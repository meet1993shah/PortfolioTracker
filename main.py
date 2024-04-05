from flask import Flask, render_template, request, jsonify, g, send_from_directory
import sqlite3
from utils import get_projections, upload_to_store, download_from_store, calculate_fire
import json
import os
import platform

app = Flask(__name__)

DATABASE = 'database.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/add_entry', methods=['GET'])
def get_add_entry():
    return render_template('add_entry.html')

# Route for adding a new portfolio entry
@app.route('/add_entry', methods=['POST'])
def post_add_entry():
    data = request.json
    conn = get_db_connection()
    c = conn.cursor()
    try:
        investment_values = [round(float(value), 2) for key, value in data['investments'].items()]
        total_balance = sum(investment_values)
        investments_json = json.dumps(data['investments'])
        c.execute('''INSERT INTO portfolio (entry_time, investments, balance)
                      VALUES (?,?,?)''', (data['entry_time'], investments_json, total_balance))
        conn.commit()
        return jsonify({'message': 'Portfolio entry added successfully.'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'message': 'Error: Entry already exists.'}), 400

@app.route('/update_entry', methods=['GET'])
def get_update_entry():
    entry_date = request.args.get('date')
    return render_template('update_entry.html', entryDate=entry_date)

# API route to update an existing portfolio entry
@app.route('/update_entry', methods=['PUT'])
def put_update_entry():
    data = request.json
    conn = get_db_connection()
    c = conn.cursor()
    try:
        investment_values = [round(float(value), 2) for key, value in data['investments'].items()]
        total_balance = sum(investment_values)
        investments_json = json.dumps(data['investments'])
        c.execute('''UPDATE portfolio 
                      SET investments=?, balance=?, updated_at=CURRENT_TIMESTAMP 
                      WHERE entry_time=?''', (investments_json, total_balance, data['entry_time']))
        conn.commit()
        return jsonify({'message': 'Portfolio entry updated successfully.'}), 200
    except sqlite3.Error:
        return jsonify({'message': 'Error: Unable to update portfolio entry.'}), 500

# API route to delete a portfolio entry
@app.route('/delete_entry', methods=['DELETE'])
def delete_entry():
    entry_time = request.args.get('date')
    conn = get_db_connection()
    c = conn.cursor()
    try:
        c.execute('''DELETE FROM portfolio WHERE entry_time=?''', (entry_time,))
        conn.commit()
        return jsonify({'message': 'Portfolio entry deleted successfully.'}), 200
    except sqlite3.Error:
        return jsonify({'message': 'Error: Unable to delete portfolio entry.'}), 500

@app.route('/get_investments')
def get_investments():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('''SELECT id, name FROM investments''')
    investments = c.fetchall()
    investments_dicts = [dict(row) for row in investments]
    return jsonify(investments_dicts)

# API route to add a new investment
@app.route('/add_investment', methods=['POST'])
def add_investment():
    data = request.json
    conn = get_db_connection()
    c = conn.cursor()
    try:
        c.execute('''INSERT INTO investments (name) VALUES (?)''', (data['name'],))
        conn.commit()
        return jsonify({'message': 'Investment added successfully.'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'message': 'Error: Investment already exists.'}), 400

# API route to update an existing investment
@app.route('/update_investment', methods=['PATCH'])
def update_investment():
    data = request.json
    conn = get_db_connection()
    c = conn.cursor()
    try:
        c.execute('''UPDATE investments SET name=? WHERE name=?''', (data['new_name'], data['existing_name']))
        conn.commit()
        return jsonify({'message': 'Investment updated successfully.'}), 200
    except sqlite3.Error:
        return jsonify({'message': 'Error: Unable to update investment.'}), 500

class UserException(Exception):
    """Custom exception for user-related errors in the API."""
    def __init__(self, message):
        super().__init__(message)

# API route to delete an investment
@app.route('/delete_investment', methods=['DELETE'])
def delete_investment():
    name = request.args.get('name')
    conn = get_db_connection()
    c = conn.cursor()
    try:
        # Get the investment id from investment name
        c.execute('''SELECT id FROM investments WHERE name=?''', (name,))
        inv_id = str(c.fetchall()[0]['id'])
        # Get all portfolio entries
        c.execute('''SELECT id, entry_time, investments FROM portfolio''')
        past_entries = c.fetchall()
        # For each entry
        for row in past_entries:
            entry_dict = dict(row)
            entry_id = entry_dict['id']
            entry_date = entry_dict['entry_time']
            entry_investments = json.loads(entry_dict['investments'])
            # check if the investment id key exists
            if inv_id in entry_investments:
                # If the investment is non-zero then raise exception
                if float(entry_investments[inv_id]) > 0:
                    raise UserException(f"{entry_date} still uses {name}")
                # Else if its zero then update the entry
                else:
                    del entry_investments[inv_id]
                    investments_json = json.dumps(entry_investments)
                    c.execute('''UPDATE portfolio 
                      SET investments=?, updated_at=CURRENT_TIMESTAMP 
                      WHERE id=?''', (investments_json, entry_id))
        # Delete the investment from the table
        c.execute('''DELETE FROM investments WHERE name=?''', (name,))
        conn.commit()
        return jsonify({'message': 'Investment deleted successfully.'}), 200
    except sqlite3.Error:
        conn.rollback()
        return jsonify({'message': 'Error: Unable to delete investment due to sql error.'}), 500
    except UserException:
        conn.rollback()
        return jsonify({'message': 'Error: Unable to delete investment due to user error.'}), 400
    except Exception:
        conn.rollback()
        return jsonify({'message': 'Error: Unable to delete investment due to internal server error.'}), 500

@app.route('/past_entries')
def get_past_entries():
    conn = get_db_connection()
    c = conn.cursor()
    try:
        c.execute('''SELECT id, name FROM investments''')
        investment_accounts = c.fetchall()
        investments_names = {str(row['id']): row['name'] for row in investment_accounts}

        c.execute('''SELECT id, entry_time, investments, balance FROM portfolio ORDER BY entry_time DESC LIMIT 10''')
        past_entries = c.fetchall()
        entries_dicts = []
        for row in past_entries:
            entry_dict = dict(row)
            entry_investments = json.loads(entry_dict['investments'])
            for key, value in entry_investments.items():
                entry_dict[investments_names[key]] = value
            del entry_dict['investments']
            entries_dicts.append(entry_dict)
        return jsonify(entries_dicts), 200
    except sqlite3.Error:
        return jsonify({'message': 'Error: Unable to fetch past entries.'}), 500

@app.route('/last_entry')
def get_last_entry():
    conn = get_db_connection()
    c = conn.cursor()
    try:
        c.execute('''SELECT id, name FROM investments''')
        investment_accounts = c.fetchall()
        investments_names = {str(row['id']): row['name'] for row in investment_accounts}

        c.execute('''SELECT investments FROM portfolio ORDER BY entry_time DESC LIMIT 1''')
        last_entry = c.fetchall()[0]
        entry_dict = dict(last_entry)
        entry_investments = json.loads(entry_dict['investments'])
        for key, value in entry_investments.items():
            entry_dict[investments_names[key]] = value
        del entry_dict['investments']
        return jsonify(entry_dict), 200
    except Exception as e:
        return jsonify({'message': 'Error: Unable to fetch last entry: ' + repr(e)}), 500

@app.route('/get_entry', methods=['GET'])
def get_entry():
    try:
        entry_date = request.args.get('date')
        conn = get_db_connection()
        c = conn.cursor()

        # Retrieve investment names
        c.execute('''SELECT id, name FROM investments''')
        investment_accounts = c.fetchall()
        investments_names = {str(row['id']): row['name'] for row in investment_accounts}

        # Retrieve entry data for the specified date
        c.execute('''SELECT investments FROM portfolio WHERE entry_time = ?''', (entry_date,))
        entry_data = c.fetchone()

        if entry_data:
            entry_dict = dict(entry_data)
            entry_investments = json.loads(entry_dict['investments'])

            # Map investment IDs to names
            for key, value in entry_investments.items():
                entry_dict[investments_names[key]] = value

            del entry_dict['investments']
            return jsonify(entry_dict), 200
        else:
            return jsonify({'message': 'No entry data found for the specified date'}), 404
    except Exception as e:
        return jsonify({'message': 'Error: Unable to fetch entry data: ' + repr(e)}), 500

@app.route('/projection', methods=['GET'])
def get_projection():
    conn = get_db_connection()
    c = conn.cursor()
    try:
        # Retrieve investment names
        c.execute('''SELECT entry_time, balance FROM portfolio ORDER BY entry_time ASC''')
        balance_data = [dict(row) for row in c.fetchall()]
        X = [row['entry_time'] for row in balance_data]
        Y = [row['balance'] for row in balance_data]
        x_in, x_date, y_res = get_projections(X, Y)
        res = {}
        res['X_data'] = x_in
        res['X_labels'] = x_date
        res['Y_data'] = y_res
        return jsonify(res), 200
    except Exception as e:
        return jsonify({'message': 'Error: Unable to load projection: ' + repr(e)}), 500

# API route to update an existing investment
@app.route('/fire_calculator', methods=['POST'])
def fire_calculator():
    data = request.json
    conn = get_db_connection()
    c = conn.cursor()
    try:
        c.execute('''SELECT entry_time, balance FROM portfolio ORDER BY entry_time ASC''')
        balance_data = [dict(row) for row in c.fetchall()]
        X = [row['entry_time'] for row in balance_data]
        Y = [row['balance'] for row in balance_data]
        fire_data = calculate_fire(X, Y, float(data["annual_expense"]), float(data["tax_rate"]), float(data["safe_withdrawal_rate"]))
        return jsonify(fire_data), 200
    except sqlite3.Error:
        return jsonify({'message': 'Error: Unable to fetch entry data'}), 500

# Route for uploading the database.db file to Google Drive
@app.route('/export', methods=['POST'])
def export_db():
    try:
        upload_to_store()
        return jsonify({'message': 'File exported successfully.'}), 200
    except Exception as e:
        return jsonify({'message': f'Error exporting file: {repr(e)}'}), 500

@app.route('/import', methods=['POST'])
def import_db():
    try:
        download_from_store()
        return jsonify({'message': 'File imported successfully.'}), 200
    except Exception as e:
        return jsonify({'message': f'Error importing file: {repr(e)}'}), 500

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.getcwd()+'/static', 'favicon.ico', mimetype='image/vnd.microsoft.icon')

if __name__ == '__main__':
    if platform.system() == 'Android':
        from android.permissions import Permission, request_permissions
        request_permissions([Permission.INTERNET, Permission.READ_EXTERNAL_STORAGE, Permission.WRITE_EXTERNAL_STORAGE])
    init_db() # Ensure the database is initialized
    app.run(debug=False, port=8080)

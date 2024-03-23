from flask import Flask, render_template, request, jsonify, g
import sqlite3

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

# Route for adding a new portfolio entry
@app.route('/add_portfolio_entry', methods=['POST'])
def add_portfolio_entry():
    data = request.json
    conn = get_db_connection()
    c = conn.cursor()
    try:
        c.execute('''INSERT INTO portfolio (entry_time, investments, balance)
                      VALUES (?,?,?)''', (data['entry_time'], data['investments'], data['balance']))
        conn.commit()
        return jsonify({'message': 'Portfolio entry added successfully.'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'message': 'Error: Entry already exists.'}), 400

# API route to update an existing portfolio entry
@app.route('/update_portfolio_entry', methods=['PUT'])
def update_portfolio_entry():
    data = request.json
    conn = get_db_connection()
    c = conn.cursor()
    try:
        c.execute('''UPDATE portfolio 
                      SET investments=?, balance=?, updated_at=CURRENT_TIMESTAMP 
                      WHERE entry_time=?''', (data['investments'], data['balance'], data['entry_time']))
        conn.commit()
        return jsonify({'message': 'Portfolio entry updated successfully.'}), 200
    except sqlite3.Error:
        return jsonify({'message': 'Error: Unable to update portfolio entry.'}), 500

# API route to delete a portfolio entry
@app.route('/delete_portfolio_entry', methods=['DELETE'])
def delete_portfolio_entry():
    entry_time = request.args.get('entry_time')
    conn = get_db_connection()
    c = conn.cursor()
    try:
        c.execute('''DELETE FROM portfolio WHERE entry_time=?''', (entry_time,))
        conn.commit()
        return jsonify({'message': 'Portfolio entry deleted successfully.'}), 200
    except sqlite3.Error:
        return jsonify({'message': 'Error: Unable to delete portfolio entry.'}), 500

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
@app.route('/update_investment', methods=['PUT'])
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

# API route to delete an investment
@app.route('/delete_investment', methods=['DELETE'])
def delete_investment():
    name = request.args.get('name')
    conn = get_db_connection()
    c = conn.cursor()
    try:
        c.execute('''DELETE FROM investments WHERE name=?''', (name,))
        conn.commit()
        return jsonify({'message': 'Investment deleted successfully.'}), 200
    except sqlite3.Error:
        return jsonify({'message': 'Error: Unable to delete investment.'}), 500

# Dummy route to retrieve past entries (replace with actual data retrieval logic)
@app.route('/past_entries')
def get_past_entries():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('''SELECT * FROM portfolio ORDER BY entry_time DESC LIMIT 10''')
    past_entries = c.fetchall()
    return jsonify(past_entries)

# Dummy route to retrieve portfolio entry data (replace with actual data retrieval logic)
@app.route('/get_portfolio_entry')
def get_portfolio_entry():
    conn = get_db_connection()
    c = conn.cursor()
    entry_time = request.args.get('entry_time')
    c.execute('''SELECT * FROM portfolio WHERE entry_time=?''', (entry_time,))
    portfolio_entry = c.fetchone()
    return jsonify(portfolio_entry)

if __name__ == '__main__':
    init_db() # Ensure the database is initialized
    app.run(debug=True)

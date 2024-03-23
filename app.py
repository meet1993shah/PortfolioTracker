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
    # Retrieve data from the form
    entry_time = request.form['entry_time']
    investments = request.form['investments']
    balance = request.form['balance']

    # Insert the data into the database
    conn = get_db_connection()
    conn.execute('INSERT INTO portfolio (entry_time, investments, balance) VALUES (?, ?, ?)',
                 (entry_time, investments, balance))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Portfolio entry added successfully'}), 200

if __name__ == '__main__':
	init_db() # Ensure the database is initialized
	app.run(debug=True)

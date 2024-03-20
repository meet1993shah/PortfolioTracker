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

@app.route('/notes', methods=['POST'])
def add_note():
	data = request.get_json()
	db = get_db()
	cursor = db.cursor()
	cursor.execute('INSERT INTO notes (quadrant, content, color) VALUES (?, ?, ?)',
		[data['quadrant'], data['content'], data['color']])
	db.commit()
	return jsonify(success=True, noteId=cursor.lastrowid)

@app.route('/notes/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
	db = get_db()
	db.execute('DELETE FROM notes WHERE id = ?', [note_id])
	db.commit()
	return jsonify(success=True)

@app.route('/notes/<int:note_id>', methods=['PUT'])
def update_note_quadrant(note_id):
	data = request.get_json()
	db = get_db()
	db.execute('UPDATE notes SET quadrant = ? WHERE id = ?',
		[data['quadrant'], note_id])
	db.commit()
	return jsonify(success=True)

@app.route('/notes/<int:note_id>', methods=['PATCH'])
def update_note_content(note_id):
	data = request.get_json()
	db = get_db()
	db.execute('UPDATE notes SET content = ? WHERE id = ?',
		[data['content'], note_id])
	db.commit()
	return jsonify(success=True)

@app.route('/notes', methods=['GET'])
def get_notes():
	db = get_db_connection()
	cursor = db.execute('SELECT id, quadrant, content, color FROM notes')
	notes = cursor.fetchall()
	db.close()
	notes_list = [{key: note[key] for key in note.keys()} for note in notes]
	return jsonify(success=True, notes=notes_list)


if __name__ == '__main__':
	init_db() # Ensure the database is initialized
	app.run(debug=True)

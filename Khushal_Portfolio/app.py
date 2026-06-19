import os
import sqlite3
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)  # Enable Cross-Origin Resource Sharing

DB_FILE = 'messages.db'

def init_db():
    """Initializes the SQLite database and creates the messages table if it doesn't exist."""
    print("Initializing SQLite Database...")
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contact_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT NOT NULL,
            message TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()
    print("Database initialized successfully.")

# Initialize database on startup
init_db()

@app.route('/')
def serve_index():
    """Serves the index.html landing page."""
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static_files(path):
    """Serves static files and directories (style.css, script.js, CV, images, etc.) recursively."""
    return send_from_directory('.', path)

@app.route('/api/contact', methods=['POST'])
def save_contact_message():
    """API endpoint to receive and store contact form submissions."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid request body, JSON expected'}), 400
            
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        subject = data.get('subject', '').strip()
        message = data.get('message', '').strip()
        
        # Validation checks
        if not all([name, email, subject, message]):
            return jsonify({'error': 'All fields (name, email, subject, message) are required'}), 400
            
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # Save to SQLite database
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO contact_messages (timestamp, name, email, subject, message)
            VALUES (?, ?, ?, ?, ?)
        ''', (timestamp, name, email, subject, message))
        conn.commit()
        conn.close()
        
        print(f"[{timestamp}] New message from {name} <{email}> - Subject: {subject}")
        return jsonify({'status': 'success', 'message': 'Message stored in database successfully!'}), 200
        
    except Exception as e:
        print(f"Error saving contact message: {str(e)}")
        return jsonify({'status': 'error', 'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("Starting Flask Backend server on http://localhost:5000...")
    app.run(port=5000, debug=True)

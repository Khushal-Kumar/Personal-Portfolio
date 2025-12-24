from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import datetime

app = Flask(__name__)
CORS(app)  # Enables your HTML frontend to talk to this Python backend

# Database Setup
def init_db():
    conn = sqlite3.connect('portfolio.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            date TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route('/submit-contact', methods=['POST'])
def submit_contact():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')
    
    if not name or not email or not message:
        return jsonify({"status": "error", "message": "All fields are required"}), 400

    try:
        conn = sqlite3.connect('portfolio.db')
        cursor = conn.cursor()
        current_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cursor.execute("INSERT INTO contacts (name, email, message, date) VALUES (?, ?, ?, ?)", 
                       (name, email, message, current_date))
        conn.commit()
        conn.close()
        print(f"New Message from {name}: {message}") # Print to console
        return jsonify({"status": "success", "message": "Message sent successfully!"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
import sqlite3
import os

DB_FILE = 'messages.db'

def view_messages():
    if not os.path.exists(DB_FILE):
        print(f"Error: Database file '{DB_FILE}' not found. Make sure you have started 'app.py' and submitted a message.")
        return

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    try:
        # Check if table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='contact_messages'")
        if not cursor.fetchone():
            print("Error: 'contact_messages' table does not exist yet. Please start 'app.py' to initialize the database.")
            return

        cursor.execute("SELECT id, timestamp, name, email, subject, message FROM contact_messages ORDER BY id DESC")
        messages = cursor.fetchall()

        if not messages:
            print("No messages stored in the database yet!")
            return

        print("\n" + "=" * 80)
        print(f"PORTFOLIO DATABASE MESSAGES (Total: {len(messages)}) - Newest First")
        print("=" * 80)

        for msg in messages:
            msg_id, timestamp, name, email, subject, body = msg
            print(f"Message ID: {msg_id} | Received at: {timestamp}")
            print(f"Name:    {name}")
            print(f"Email:   {email}")
            print(f"Subject: {subject}")
            print(f"Message:")
            # Indent message for readability
            indented_body = "\n".join("   " + line for line in body.splitlines())
            print(indented_body)
            print("-" * 80)

    except sqlite3.Error as e:
        print(f"Database error: {e}")
    finally:
        conn.close()

if __name__ == '__main__':
    view_messages()

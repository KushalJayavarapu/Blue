import sqlite3
import os

DB_FILE = "ecosphere.db"

def get_connection():
    """
    Creates and returns a connection to the SQLite database.
    """
    conn = sqlite3.connect(DB_FILE)
    conn.execute("PRAGMA foreign_keys = ON;")
    conn.row_factory = sqlite3.Row
    return conn

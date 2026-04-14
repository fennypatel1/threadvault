#import sqlite3
#import os

#BASE_DIR = os.path.dirname(os.path.abspath(__file__))
#DB_PATH = os.path.join(BASE_DIR, "threadvault.db")

#def get_connection():
#    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
#    conn.row_factory = sqlite3.Row
#    return conn

import os
import psycopg2

def get_connection():
    return psycopg2.connect(os.environ["DATABASE_URL"])
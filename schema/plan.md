# Data Migration Plan and History

This document explains how the dummy data from the CSV files was mapped and inserted into the `ecosphere.db` database.

## Why are there two SQL files?

1. **`insert_data.sql`**: 
   This was the first attempt at generating the SQL statements. It took the CSV headers exactly as they were and generated raw `INSERT` statements. However, the CSV column names did not perfectly align with the actual database schema defined in `Blue/schema/db.py`. For example:
   - The CSV had `department_id` but the table had `id`.
   - The CSV used a string name for `department` in `users.csv`, but the `users` table required an integer `department_id` as a foreign key.
   - Certain `NOT NULL` constraints were violated because the CSV didn't have values for them (e.g., `auditor_id` in `audits.csv`).

2. **`insert_dummy_data.sql`**: 
   This was the second and successful attempt. A Python script (`populate_db.py`) mapped the CSV columns exactly to the `ecosphere.db` schema. It resolved foreign keys (by looking up department IDs), handled missing default values, and added `CREATE TABLE` commands for tables that existed in the CSVs but not in `db.py` (like `carbon_transactions`). 

## How does the data get into `ecosphere.db`?

Once `insert_dummy_data.sql` was generated, the data was pushed into `ecosphere.db` using Python's built-in `sqlite3` module. The Python script connects to the database file and executes the entire SQL script, essentially running all those `INSERT` commands directly against the database and committing the changes.

## Commands Executed

Here is the chronological order of commands used to achieve this:

1. **Generate the first raw SQL file** (created `insert_data.sql`):
   ```bash
   python generate_sql.py
   ```

2. **Generate the correct, mapped SQL file** (created `insert_dummy_data.sql`):
   ```bash
   python populate_db.py
   ```

3. **Recreate the empty database schema**:
   ```bash
   python Blue/schema/db.py
   ```

4. **Execute the SQL script to push data into `ecosphere.db`**:
   The final successful run to insert the data was done using an inline Python command to read `insert_dummy_data.sql` and execute it directly:
   ```bash
   python -c "
   import sqlite3
   conn = sqlite3.connect('d:/code.folder/oddoo/ecosphere.db')
   with open('d:/code.folder/oddoo/insert_dummy_data.sql', 'r', encoding='utf-8') as f:
       sql = f.read()
   conn.executescript(sql)
   conn.commit()
   "
   ```

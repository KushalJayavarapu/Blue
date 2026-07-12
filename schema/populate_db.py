import csv
import os
import sqlite3

data_dir = 'd:/code.folder/oddoo/Data'
db_path = 'd:/code.folder/oddoo/ecosphere.db'

def get_department_id_map():
    dept_map = {}
    dept_file = os.path.join(data_dir, 'departments.csv')
    if os.path.exists(dept_file):
        with open(dept_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                dept_map[row['name']] = row['department_id']
    return dept_map

dept_map = get_department_id_map()

# Map CSV to Tables
mappings = [
    {
        'csv': 'departments.csv',
        'table': 'departments',
        'cols': ['id', 'name', 'code', 'status'],
        'csv_cols': ['department_id', 'name', 'code', 'status']
    },
    {
        'csv': 'users.csv',
        'table': 'users',
        'cols': ['id', 'name', 'xp', 'department_id'],
        'csv_cols': ['user_id', 'name', None, 'department']
    },
    {
        'csv': 'badges.csv',
        'table': 'badges',
        'cols': ['id', 'name'],
        'csv_cols': ['badge_id', 'badge']
    },
    {
        'csv': 'csr_activities.csv',
        'table': 'csr_activities',
        'cols': ['id', 'title', 'category', 'points', 'status'],
        'csv_cols': ['activity_id', 'title', 'category', 'points', 'status']
    },
    {
        'csv': 'challenges.csv',
        'table': 'challenges',
        'cols': ['id', 'name', 'xp_reward', 'difficulty', 'status'],
        'csv_cols': ['challenge_id', 'title', 'xp', 'difficulty', 'status']
    },
    {
        'csv': 'environmental_goals.csv',
        'table': 'environmental_goals',
        'cols': ['id', 'name', 'target_co2', 'current_co2', 'deadline', 'department_id'],
        'csv_cols': ['goal_id', 'goal_name', 'target_reduction_percent', 'progress_percent', 'deadline', 'department']
    },
    {
        'csv': 'audits.csv',
        'table': 'audits',
        'cols': ['id', 'title', 'status', 'department_id', 'auditor_id'],
        'csv_cols': ['audit_id', 'title', 'status', 'department', 'dummy_auditor_id']
    },
    {
        'csv': 'compliance_issues.csv',
        'table': 'compliance_issues',
        'cols': ['id', 'issue', 'severity', 'status', 'department_id'],
        'csv_cols': ['issue_id', 'title', 'severity', 'status', 'department']
    },
    {
        'csv': 'employee_participation.csv',
        'table': 'participations',
        'cols': ['id', 'user_id', 'activity_id', 'points', 'status'],
        'csv_cols': ['participation_id', 'user_id', 'activity_id', 'points_earned', 'approval_status']
    }
]

# Write SQL script
sql_file_path = 'd:/code.folder/oddoo/insert_dummy_data.sql'
with open(sql_file_path, 'w', encoding='utf-8') as f_out:
    
    # Missing tables
    f_out.write("CREATE TABLE IF NOT EXISTS carbon_transactions (\n")
    f_out.write("    transaction_id INTEGER PRIMARY KEY,\n")
    f_out.write("    source TEXT,\n")
    f_out.write("    department TEXT,\n")
    f_out.write("    co2_kg REAL,\n")
    f_out.write("    date TIMESTAMP\n")
    f_out.write(");\n\n")

    f_out.write("CREATE TABLE IF NOT EXISTS notifications (\n")
    f_out.write("    notification_id INTEGER PRIMARY KEY,\n")
    f_out.write("    user_id INTEGER,\n")
    f_out.write("    message TEXT,\n")
    f_out.write("    read TEXT\n")
    f_out.write(");\n\n")
    
    f_out.write("CREATE TABLE IF NOT EXISTS rewards (\n")
    f_out.write("    reward_id INTEGER PRIMARY KEY,\n")
    f_out.write("    reward TEXT,\n")
    f_out.write("    points INTEGER\n")
    f_out.write(");\n\n")

    for map_info in mappings:
        csv_file = os.path.join(data_dir, map_info['csv'])
        if not os.path.exists(csv_file):
            continue
            
        f_out.write(f"-- Data for {map_info['table']}\n")
        with open(csv_file, 'r', encoding='utf-8') as f_in:
            reader = csv.DictReader(f_in)
            for row in reader:
                values = []
                for csv_col in map_info['csv_cols']:
                    if csv_col is None:
                        values.append('NULL')
                        continue
                    
                    val = row.get(csv_col, '')
                    
                    if csv_col == 'dummy_auditor_id':
                        val = '1'
                    elif csv_col == 'department' and map_info['table'] != 'carbon_transactions':
                        # lookup department id
                        val = dept_map.get(val, 'NULL')
                        values.append(str(val) if val != 'NULL' else 'NULL')
                        continue
                    elif not val:
                        values.append('NULL')
                        continue
                    else:
                        val = val.replace("'", "''")
                        
                    if csv_col != 'dummy_auditor_id' and csv_col != 'department':
                        values.append(f"'{val}'")
                    else:
                        values.append(f"{val}")
                        
                cols_str = ', '.join(map_info['cols'])
                vals_str = ', '.join(values)
                f_out.write(f"INSERT INTO {map_info['table']} ({cols_str}) VALUES ({vals_str});\n")
        f_out.write("\n")

    # Handle unmapped CSVs directly
    for unmapped in ['carbon_transactions.csv', 'notifications.csv', 'rewards.csv']:
        csv_file = os.path.join(data_dir, unmapped)
        if os.path.exists(csv_file):
            table_name = unmapped.replace('.csv', '')
            f_out.write(f"-- Data for {table_name}\n")
            with open(csv_file, 'r', encoding='utf-8') as f_in:
                reader = csv.DictReader(f_in)
                headers = reader.fieldnames
                for row in reader:
                    vals = [f"'{row[h].replace(str(chr(39)), str(chr(39))+str(chr(39)))}'" if row[h] else 'NULL' for h in headers]
                    cols_str = ', '.join(headers)
                    vals_str = ', '.join(vals)
                    f_out.write(f"INSERT INTO {table_name} ({cols_str}) VALUES ({vals_str});\n")
            f_out.write("\n")
            
print("Generated insert_dummy_data.sql")

# Also apply it to db directly
conn = sqlite3.connect(db_path)
with open(sql_file_path, 'r', encoding='utf-8') as f:
    sql_script = f.read()
try:
    conn.executescript(sql_script)
    conn.commit()
    print("Database populated successfully.")
except Exception as e:
    print(f"Error populating DB: {e}")
conn.close()

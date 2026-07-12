import csv
import os

data_dir = 'd:/code.folder/oddoo/Data'
output_sql = 'd:/code.folder/oddoo/insert_data.sql'
db_file = 'd:/code.folder/oddoo/ecosphere.db'

# Map CSV filename to Table Name
table_mapping = {
    'departments.csv': 'departments',
    'users.csv': 'users',
    'badges.csv': 'badges',
    'csr_activities.csv': 'csr_activities',
    'challenges.csv': 'challenges',
    'environmental_goals.csv': 'environmental_goals',
    'audits.csv': 'audits',
    'compliance_issues.csv': 'compliance_issues',
    'employee_participation.csv': 'participations'
}

order_of_insertion = [
    'departments.csv',
    'users.csv',
    'badges.csv',
    'csr_activities.csv',
    'challenges.csv',
    'employee_participation.csv',
    'environmental_goals.csv',
    'audits.csv',
    'compliance_issues.csv'
]

def escape_sql_string(val):
    if val is None or val == '':
        return 'NULL'
    # Check if it's a number
    try:
        float(val)
        return str(val)
    except ValueError:
        pass
    # It's a string, escape quotes
    val = val.replace("'", "''")
    return f"'{val}'"

with open(output_sql, 'w', encoding='utf-8') as sql_file:
    for csv_file in order_of_insertion:
        file_path = os.path.join(data_dir, csv_file)
        if not os.path.exists(file_path):
            continue
            
        table_name = table_mapping[csv_file]
        sql_file.write(f"-- Data for {table_name}\n")
        
        with open(file_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            headers = reader.fieldnames
            
            for row in reader:
                columns = ', '.join(headers)
                values_list = []
                for header in headers:
                    val = row[header]
                    if val is None or val == '':
                        values_list.append('NULL')
                    else:
                        # try parse as float, unless it is a date or looks like a string
                        if header.lower() in ('id', 'department_id', 'parent_id', 'user_id', 'xp', 'points', 'activity_id', 'challenge_id', 'auditor_id', 'badge_id', 'xp_reward'):
                            try:
                                v = int(float(val))
                                values_list.append(str(v))
                            except ValueError:
                                values_list.append("NULL")
                        elif header.lower() in ('current_co2', 'target_co2'):
                            try:
                                v = float(val)
                                values_list.append(str(v))
                            except ValueError:
                                values_list.append("NULL")
                        elif header.lower() in ('enable_auto_emission_calculation', 'require_evidence_for_csr', 'auto_award_badges', 'email_alerts_for_compliance', 'evidence_required'):
                            # boolean
                            v = val.strip().lower()
                            if v in ('1', 'true', 'yes'):
                                values_list.append('1')
                            else:
                                values_list.append('0')
                        else:
                            # string
                            v = str(val).replace("'", "''")
                            values_list.append(f"'{v}'")

                values = ', '.join(values_list)
                sql_file.write(f"INSERT INTO {table_name} ({columns}) VALUES ({values});\n")
        sql_file.write("\n")

print('SQL script generated.')

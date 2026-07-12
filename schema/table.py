from db import get_connection

def create_schema():
    """
    Creates all necessary tables for the EcoSphere platform.
    """
    conn = get_connection()
    cursor = conn.cursor()

    # --- SETTINGS & DEPARTMENTS ---
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS departments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            code TEXT UNIQUE NOT NULL,
            head_name TEXT,
            status TEXT DEFAULT 'Active',
            parent_id INTEGER,
            FOREIGN KEY (parent_id) REFERENCES departments (id)
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS system_settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            enable_auto_emission_calculation BOOLEAN DEFAULT 0,
            require_evidence_for_csr BOOLEAN DEFAULT 1,
            auto_award_badges BOOLEAN DEFAULT 1,
            email_alerts_for_compliance BOOLEAN DEFAULT 1
        )
    """)

    # --- USERS ---
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            xp INTEGER DEFAULT 0,
            department_id INTEGER,
            FOREIGN KEY (department_id) REFERENCES departments (id)
        )
    """)

    # --- SOCIAL (CSR) ---
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS csr_activities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            icon TEXT,
            category TEXT,
            points INTEGER DEFAULT 0,
            evidence_required BOOLEAN DEFAULT 1,
            status TEXT DEFAULT 'Open',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # --- GAMIFICATION ---
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS challenges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            xp_reward INTEGER DEFAULT 0,
            difficulty TEXT,
            deadline TIMESTAMP,
            status TEXT DEFAULT 'Active'
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS badges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            icon TEXT
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_badges (
            user_id INTEGER NOT NULL,
            badge_id INTEGER NOT NULL,
            PRIMARY KEY (user_id, badge_id),
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (badge_id) REFERENCES badges (id) ON DELETE CASCADE
        )
    """)

    # --- PARTICIPATION (Shared for Social & Gamification) ---
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS participations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            activity_id INTEGER,
            challenge_id INTEGER,
            proof_url TEXT,
            points INTEGER DEFAULT 0,
            status TEXT DEFAULT 'Pending',
            joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (activity_id) REFERENCES csr_activities (id) ON DELETE CASCADE,
            FOREIGN KEY (challenge_id) REFERENCES challenges (id) ON DELETE CASCADE
        )
    """)

    # --- ENVIRONMENTAL ---
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS environmental_goals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            target_co2 REAL,
            current_co2 REAL DEFAULT 0,
            deadline TIMESTAMP,
            status TEXT DEFAULT 'Active',
            department_id INTEGER NOT NULL,
            FOREIGN KEY (department_id) REFERENCES departments (id)
        )
    """)

    # --- GOVERNANCE ---
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS audits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            date TIMESTAMP,
            findings TEXT,
            status TEXT DEFAULT 'Completed',
            department_id INTEGER NOT NULL,
            auditor_id INTEGER NOT NULL,
            FOREIGN KEY (department_id) REFERENCES departments (id),
            FOREIGN KEY (auditor_id) REFERENCES users (id)
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS compliance_issues (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            issue TEXT NOT NULL,
            severity TEXT,
            status TEXT DEFAULT 'Open',
            department_id INTEGER NOT NULL,
            FOREIGN KEY (department_id) REFERENCES departments (id)
        )
    """)

    conn.commit()
    conn.close()
    print("Full EcoSphere database schema created successfully in ecosphere.db!")

if __name__ == "__main__":
    create_schema()

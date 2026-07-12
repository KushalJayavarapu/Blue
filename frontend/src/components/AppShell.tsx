import { Outlet, Link } from "react-router-dom";

export default function AppShell() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">EcoSphere</h1>
        <nav className="space-y-2">
          <Link to="/" className="block px-4 py-2 rounded hover:bg-slate-800">
            Dashboard
          </Link>
          <Link to="/environmental" className="block px-4 py-2 rounded hover:bg-slate-800">
            Environmental
          </Link>
          <Link to="/social" className="block px-4 py-2 rounded hover:bg-slate-800">
            Social
          </Link>
          <Link to="/governance" className="block px-4 py-2 rounded hover:bg-slate-800">
            Governance
          </Link>
          <Link to="/gamification" className="block px-4 py-2 rounded hover:bg-slate-800">
            Gamification
          </Link>
          <Link to="/reports" className="block px-4 py-2 rounded hover:bg-slate-800">
            Reports
          </Link>
          <Link to="/settings" className="block px-4 py-2 rounded hover:bg-slate-800">
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b p-6">
          <h2 className="text-xl font-semibold">Employee: John Doe | Department: Engineering</h2>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

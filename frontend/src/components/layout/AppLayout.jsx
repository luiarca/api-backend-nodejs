import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./AppLayout.css";

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" to="/">
          Inventario React
        </Link>

        <nav className="menu">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/items">Items</NavLink>
          {(user?.rol === "admin" || user?.rol === "super_admin") && (
            <NavLink to="/items/new">Nuevo item</NavLink>
          )}
          {user?.rol === "super_admin" && <NavLink to="/users">Usuarios</NavLink>}
        </nav>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">PIAD-527_FULLSTACK DEVELOPER SOFTWARE</p>
            <h1>Frontend inicial del sistema de inventario</h1>
          </div>

          <div className="session-box">
            <div>
              <strong>{user?.email}</strong>
              <p>{user?.rol}</p>
            </div>
            <button type="button" onClick={logout}>
              Cerrar sesion
            </button>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}

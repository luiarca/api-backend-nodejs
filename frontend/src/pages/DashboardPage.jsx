import { useAuth } from "../hooks/useAuth";

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <section className="page-grid">
      <article className="hero-card">
        <p className="section-kicker">Panel inicial</p>
        <h2>Bienvenido al frontend base del inventario</h2>
        <p>
          Esta interfaz fue organizada para consumir la API REST con JWT,
          diferenciar permisos por rol y servir como punto de partida para la
          actividad academica.
        </p>
      </article>

      <article className="stat-card">
        <span>Usuario actual</span>
        <strong>{user?.email}</strong>
      </article>

      <article className="stat-card">
        <span>Rol actual</span>
        <strong>{user?.rol}</strong>
      </article>

      <article className="stat-card">
        <span>Permisos</span>
        <strong>
          {user?.rol === "usuario"
            ? "Lectura de items"
            : user?.rol === "admin"
              ? "CRUD de items"
              : "CRUD de items y usuarios"}
        </strong>
      </article>
    </section>
  );
}

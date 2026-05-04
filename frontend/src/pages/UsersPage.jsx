import { useEffect, useState } from "react";
import { UserTable } from "../components/users/UserTable";
import { useAuth } from "../hooks/useAuth";
import { createManagedUser, deleteUser, getUsers, updateUserRole } from "../services/userService";

export function UsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ email: "", password: "", rol: "admin" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadUsers = async () => {
    try {
      setError("");
      const data = await getUsers(token);
      setUsers(data.usuarios || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      await createManagedUser(form, token);
      setForm({ email: "", password: "", rol: "admin" });
      setMessage("Usuario creado correctamente.");
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRoleChange = async (id, rol) => {
    try {
      await updateUserRole(id, { rol }, token);
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseas eliminar este usuario?")) {
      return;
    }

    try {
      await deleteUser(id, token);
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="stack-gap">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Administracion</p>
          <h2>Gestion de usuarios</h2>
        </div>
        <span className="pill">{users.length} usuarios</span>
      </div>

      <form className="form-card split-form" onSubmit={handleCreate}>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Rol
          <select name="rol" value={form.rol} onChange={handleChange}>
            <option value="admin">admin</option>
            <option value="usuario">usuario</option>
          </select>
        </label>

        <button type="submit">Crear usuario</button>
      </form>

      {message && <p className="success-text">{message}</p>}
      {error && <p className="error-text">{error}</p>}

      <UserTable users={users} onRoleChange={handleRoleChange} onDelete={handleDelete} />
    </section>
  );
}

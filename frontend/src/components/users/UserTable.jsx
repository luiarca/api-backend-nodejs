export function UserTable({ users, onRoleChange, onDelete }) {
  return (
    <div className="table-card">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.rol}</td>
              <td className="table-actions">
                <button type="button" onClick={() => onRoleChange(user.id, "usuario")}>
                  Pasar a usuario
                </button>
                <button type="button" onClick={() => onRoleChange(user.id, "admin")}>
                  Pasar a admin
                </button>
                <button type="button" onClick={() => onDelete(user.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

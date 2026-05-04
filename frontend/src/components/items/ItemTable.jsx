import { Link } from "react-router-dom";

export function ItemTable({ items, canManage, onDelete }) {
  return (
    <div className="table-card">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripcion</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nombre}</td>
              <td>{item.descripcion || "Sin descripcion"}</td>
              <td>{item.estado ? "Activo" : "Inactivo"}</td>
              <td className="table-actions">
                <Link to={`/items/${item.id}`}>Ver</Link>
                {canManage && <Link to={`/items/${item.id}/edit`}>Editar</Link>}
                {canManage && (
                  <button type="button" onClick={() => onDelete(item.id)}>
                    Eliminar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

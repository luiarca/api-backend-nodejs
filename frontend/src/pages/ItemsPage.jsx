import { useEffect, useState } from "react";
import { ItemTable } from "../components/items/ItemTable";
import { useAuth } from "../hooks/useAuth";
import { deleteItem, getItems } from "../services/itemService";

export function ItemsPage() {
  const { token, user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const canManage = user?.rol === "admin" || user?.rol === "super_admin";

  const loadItems = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await getItems(token);
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Deseas eliminar este item?")) {
      return;
    }

    try {
      await deleteItem(id, token);
      await loadItems();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p>Cargando items...</p>;
  }

  return (
    <section className="stack-gap">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Inventario</p>
          <h2>Listado de items</h2>
        </div>
        <span className="pill">{items.length} registros</span>
      </div>

      {error && <p className="error-text">{error}</p>}

      <ItemTable items={items} canManage={canManage} onDelete={handleDelete} />
    </section>
  );
}

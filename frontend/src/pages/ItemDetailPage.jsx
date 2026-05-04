import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getItemById } from "../services/itemService";

export function ItemDetailPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadItem() {
      try {
        setError("");
        setLoading(true);
        const data = await getItemById(id, token);
        setItem(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadItem();
  }, [id, token]);

  if (loading) {
    return <p>Cargando detalle...</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  return (
    <article className="detail-card">
      <p className="section-kicker">Detalle del item</p>
      <h2>{item?.nombre}</h2>
      <p>{item?.descripcion || "Este item no tiene descripcion registrada."}</p>
      <div className="detail-meta">
        <span>Estado: {item?.estado ? "Activo" : "Inactivo"}</span>
        <span>Fecha: {item?.created_at || "No disponible"}</span>
      </div>
      <Link className="inline-link" to="/items">
        Volver al listado
      </Link>
    </article>
  );
}

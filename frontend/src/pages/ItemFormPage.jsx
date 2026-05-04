import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ItemForm } from "../components/items/ItemForm";
import { useAuth } from "../hooks/useAuth";
import { createItem, getItemById, updateItem } from "../services/itemService";

export function ItemFormPage({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuth();
  const [initialValues, setInitialValues] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(mode === "edit");

  useEffect(() => {
    if (mode !== "edit") {
      return;
    }

    async function loadItem() {
      try {
        const data = await getItemById(id, token);
        setInitialValues({
          nombre: data.nombre,
          descripcion: data.descripcion || "",
          estado: data.estado
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadItem();
  }, [id, mode, token]);

  const handleSubmit = async (payload) => {
    try {
      setError("");

      if (mode === "edit") {
        await updateItem(id, payload, token);
      } else {
        await createItem(payload, token);
      }

      navigate("/items");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p>Cargando formulario...</p>;
  }

  return (
    <section className="stack-gap">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Gestion de items</p>
          <h2>{mode === "edit" ? "Editar item" : "Crear nuevo item"}</h2>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      <ItemForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitLabel={mode === "edit" ? "Actualizar item" : "Crear item"}
      />
    </section>
  );
}

import { useState } from "react";

export function ItemForm({ initialValues, onSubmit, submitLabel = "Guardar" }) {
  const [form, setForm] = useState(
    initialValues || {
      nombre: "",
      descripcion: "",
      estado: true
    }
  );

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <label>
        Nombre
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Descripcion
        <textarea
          name="descripcion"
          rows="5"
          value={form.descripcion}
          onChange={handleChange}
        />
      </label>

      <label className="checkbox-row">
        <input
          type="checkbox"
          name="estado"
          checked={form.estado}
          onChange={handleChange}
        />
        Item activo
      </label>

      <button type="submit">{submitLabel}</button>
    </form>
  );
}

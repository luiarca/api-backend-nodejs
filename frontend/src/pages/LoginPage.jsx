import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { AuthCard } from "../components/auth/AuthCard";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="auth-screen">
      <AuthCard
        title="Acceso al sistema de inventario"
        subtitle="Consume la API REST existente con JWT y vistas segun rol."
      >
        <form className="form-card" onSubmit={handleSubmit}>
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

          {error && <p className="error-text">{error}</p>}

          <button type="submit">Ingresar</button>
          <p className="auth-footer">
            No tienes cuenta? <Link to="/register">Registrate</Link>
          </p>
        </form>
      </AuthCard>
    </main>
  );
}

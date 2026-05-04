import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthCard } from "../components/auth/AuthCard";
import { registerRequest } from "../services/authService";

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await registerRequest(form);
      setMessage("Registro completado. Ahora puedes iniciar sesion.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="auth-screen">
      <AuthCard
        title="Registro publico"
        subtitle="Esta vista crea usuarios con rol usuario desde /register."
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

          {message && <p className="success-text">{message}</p>}
          {error && <p className="error-text">{error}</p>}

          <button type="submit">Crear cuenta</button>
          <p className="auth-footer">
            Ya tienes cuenta? <Link to="/login">Ingresa aqui</Link>
          </p>
        </form>
      </AuthCard>
    </main>
  );
}

export function AuthCard({ title, subtitle, children }) {
  return (
    <section className="auth-card">
      <div className="auth-copy">
        <p className="auth-kicker">React + Node.js + MySQL</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

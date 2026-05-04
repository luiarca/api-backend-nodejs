const bcrypt = require("bcryptjs");

const db = require("./db");

const ensureDatabase = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      rol ENUM('super_admin', 'admin', 'usuario') NOT NULL DEFAULT 'usuario',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      descripcion TEXT,
      estado BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const [roleColumn] = await db.query(`
    SELECT COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'usuarios'
      AND COLUMN_NAME = 'rol'
  `);

  if (roleColumn.length === 0) {
    await db.query(`
      ALTER TABLE usuarios
      ADD COLUMN rol ENUM('super_admin', 'admin', 'usuario') NOT NULL DEFAULT 'usuario'
      AFTER password
    `);
  }
};

const ensureSuperAdmin = async () => {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    return;
  }

  const [existing] = await db.query(
    "SELECT id FROM usuarios WHERE email = ?",
    [email]
  );

  if (existing.length > 0) {
    await db.query(
      "UPDATE usuarios SET rol = 'super_admin' WHERE email = ?",
      [email]
    );
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.query(
    "INSERT INTO usuarios (email, password, rol) VALUES (?, ?, 'super_admin')",
    [email, hashedPassword]
  );
};

const bootstrap = async () => {
  await ensureDatabase();
  await ensureSuperAdmin();
};

module.exports = bootstrap;

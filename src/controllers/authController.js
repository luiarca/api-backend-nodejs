const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../config/db");

const VALID_ROLES = ["super_admin", "admin", "usuario"];

const generateToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
      rol: user.rol
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "2h"
    }
  );

const createUser = async ({ email, password, rol }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await db.query(
    "INSERT INTO usuarios (email, password, rol) VALUES (?, ?, ?)",
    [email, hashedPassword, rol]
  );

  return {
    id: result.insertId,
    email,
    rol
  };
};

const ensureEmailAvailability = async (email) => {
  const [existingUsers] = await db.query(
    "SELECT id FROM usuarios WHERE email = ?",
    [email]
  );

  return existingUsers.length === 0;
};

const registerPublic = async (req, res, next) => {
  try {
    const { email, password, rol } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        mensaje: "Email y password son obligatorios"
      });
    }

    const isAvailable = await ensureEmailAvailability(email);

    if (!isAvailable) {
      return res.status(409).json({ mensaje: "El usuario ya existe" });
    }

    if (rol && rol !== "usuario") {
      return res.status(403).json({
        mensaje:
          "El registro publico solo permite rol usuario. Usa /register/admin o /api/admin/users para crear admins"
      });
    }

    const usuario = await createUser({
      email,
      password,
      rol: "usuario"
    });

    return res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario
    });
  } catch (error) {
    next(error);
  }
};

const registerByAdmin = async (req, res, next) => {
  try {
    const { email, password, rol } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        mensaje: "Email y password son obligatorios"
      });
    }

    const isAvailable = await ensureEmailAvailability(email);

    if (!isAvailable) {
      return res.status(409).json({ mensaje: "El usuario ya existe" });
    }

    let rolAsignado = "usuario";

    if (req.user.rol === "super_admin") {
      if (rol && !VALID_ROLES.includes(rol)) {
        return res.status(400).json({ mensaje: "Rol invalido" });
      }

      if (rol === "super_admin") {
        return res.status(403).json({
          mensaje: "No se permite crear otro super_admin desde esta ruta"
        });
      }

      rolAsignado = rol || "usuario";
    } else if (req.user.rol === "admin") {
      if (rol && rol !== "usuario") {
        return res.status(403).json({
          mensaje: "Un admin solo puede registrar usuarios con rol usuario"
        });
      }

      rolAsignado = "usuario";
    } else {
      return res.status(403).json({
        mensaje: "No tienes permisos para registrar usuarios"
      });
    }

    const usuario = await createUser({
      email,
      password,
      rol: rolAsignado
    });

    return res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        mensaje: "Email y password son obligatorios"
      });
    }

    const [users] = await db.query(
      "SELECT id, email, password, rol FROM usuarios WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ mensaje: "Usuario no encontrado" });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ mensaje: "Contrasena incorrecta" });
    }

    const token = generateToken(user);

    return res.json({
      mensaje: "Usuario ingreso correctamente",
      token,
      usuario: {
        id: user.id,
        email: user.email,
        rol: user.rol
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerPublic,
  registerByAdmin,
  login
};

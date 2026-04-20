const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const pool = require("../config/db");

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        mensaje: "Email y password son obligatorios"
      });
    }

    const [existingUsers] = await pool.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ mensaje: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO usuarios (email, password) VALUES (?, ?)",
      [email, hashedPassword]
    );

    return res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario: {
        id: result.insertId,
        email
      }
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

    const [users] = await pool.query(
      "SELECT id, email, password FROM usuarios WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ mensaje: "Credenciales invalidas" });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ mensaje: "Credenciales invalidas" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "2h"
      }
    );

    return res.json({
      mensaje: "Login exitoso",
      token
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login
};

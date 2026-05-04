const bcrypt = require("bcryptjs");

const db = require("../config/db");

const VALID_ROLES = ["usuario", "admin", "super_admin"];
const MANAGEABLE_ROLES = ["usuario", "admin"];

const createUser = async (req, res, next) => {
  try {
    const { email, password, rol } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        mensaje: "Email y password son obligatorios"
      });
    }

    if (rol && !MANAGEABLE_ROLES.includes(rol)) {
      return res.status(400).json({
        mensaje: "Solo se permite crear usuarios con rol admin o usuario"
      });
    }

    const [existingUsers] = await db.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ mensaje: "El usuario ya existe" });
    }

    const rolAsignado = rol || "admin";
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO usuarios (email, password, rol) VALUES (?, ?, ?)",
      [email, hashedPassword, rolAsignado]
    );

    res.status(201).json({
      mensaje: "Usuario creado correctamente",
      usuario: {
        id: result.insertId,
        email,
        rol: rolAsignado
      }
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const [users] = await db.query(
      "SELECT id, email, rol, created_at FROM usuarios ORDER BY id ASC"
    );

    res.json({
      total: users.length,
      usuarios: users
    });
  } catch (error) {
    next(error);
  }
};

const changeUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    if (!VALID_ROLES.includes(rol)) {
      return res.status(400).json({ mensaje: "Rol invalido" });
    }

    if (rol === "super_admin") {
      return res.status(403).json({
        mensaje: "No se permite asignar el rol super_admin desde esta ruta"
      });
    }

    if (Number(id) === req.user.id && rol !== "super_admin") {
      return res.status(403).json({
        mensaje: "No puedes cambiar tu propio rol"
      });
    }

    const [result] = await db.query(
      "UPDATE usuarios SET rol = ? WHERE id = ?",
      [rol, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json({
      mensaje: "Rol actualizado correctamente",
      usuario: {
        id: Number(id),
        rol
      }
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (Number(id) === req.user.id) {
      return res.status(403).json({
        mensaje: "No puedes eliminar tu propia cuenta"
      });
    }

    const [result] = await db.query("DELETE FROM usuarios WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  changeUserRole,
  deleteUser
};

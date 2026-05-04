const jwt = require("jsonwebtoken");

const db = require("../config/db");

const resolveAuthenticatedUser = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const [rows] = await db.query(
    "SELECT id, email, rol FROM usuarios WHERE id = ?",
    [decoded.id]
  );

  if (rows.length === 0) {
    const error = new Error("Usuario no encontrado");
    error.status = 401;
    throw error;
  }

  return rows[0];
};

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ mensaje: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = await resolveAuthenticatedUser(token);
    next();
  } catch (error) {
    return res.status(error.status || 401).json({
      mensaje: error.status === 401 ? error.message : "Token invalido o expirado"
    });
  }
};

const optionalAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = await resolveAuthenticatedUser(token);
    next();
  } catch (error) {
    return res.status(error.status || 401).json({
      mensaje: error.status === 401 ? error.message : "Token invalido o expirado"
    });
  }
};

module.exports = authMiddleware;
module.exports.optionalAuthMiddleware = optionalAuthMiddleware;

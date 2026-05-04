const isSuperAdmin = (req, res, next) => {
  if (req.user.rol !== "super_admin") {
    return res.status(403).json({
      mensaje: "Acceso denegado. Se requiere rol super_admin"
    });
  }

  next();
};

const isAdminOrSuperAdmin = (req, res, next) => {
  if (!["admin", "super_admin"].includes(req.user.rol)) {
    return res.status(403).json({
      mensaje: "Acceso denegado. Se requiere rol admin o super_admin"
    });
  }

  next();
};

const isAuthenticatedUser = (req, res, next) => {
  if (!["usuario", "admin", "super_admin"].includes(req.user.rol)) {
    return res.status(403).json({
      mensaje: "Acceso denegado. Se requiere un usuario autenticado"
    });
  }

  next();
};

module.exports = {
  isSuperAdmin,
  isAdminOrSuperAdmin,
  isAuthenticatedUser
};

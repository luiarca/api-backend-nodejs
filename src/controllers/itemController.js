const pool = require("../config/db");

const parseEstado = (value, defaultValue = true) => {
  if (value === undefined || value === null) {
    return defaultValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (normalized === "true" || normalized === "1") {
      return true;
    }

    if (normalized === "false" || normalized === "0") {
      return false;
    }
  }

  return Boolean(value);
};

const getAllItems = async (req, res, next) => {
  try {
    const [items] = await pool.query(
      "SELECT id, nombre, descripcion, estado, created_at FROM items ORDER BY id ASC"
    );

    res.json(items);
  } catch (error) {
    next(error);
  }
};

const getItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [items] = await pool.query(
      "SELECT id, nombre, descripcion, estado, created_at FROM items WHERE id = ?",
      [id]
    );

    if (items.length === 0) {
      return res.status(404).json({ mensaje: "Item no encontrado" });
    }

    res.json(items[0]);
  } catch (error) {
    next(error);
  }
};

const createItem = async (req, res, next) => {
  try {
    const { nombre, descripcion, estado } = req.body;

    if (!nombre) {
      return res.status(400).json({ mensaje: "El campo nombre es obligatorio" });
    }

    const itemEstado = parseEstado(estado, true);

    const [result] = await pool.query(
      "INSERT INTO items (nombre, descripcion, estado) VALUES (?, ?, ?)",
      [nombre, descripcion || null, itemEstado]
    );

    res.status(201).json({
      mensaje: "Item creado correctamente",
      item: {
        id: result.insertId,
        nombre,
        descripcion: descripcion || null,
        estado: itemEstado
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, estado } = req.body;

    if (!nombre) {
      return res.status(400).json({ mensaje: "El campo nombre es obligatorio" });
    }

    const [existing] = await pool.query("SELECT id FROM items WHERE id = ?", [id]);

    if (existing.length === 0) {
      return res.status(404).json({ mensaje: "Item no encontrado" });
    }

    const itemEstado = parseEstado(estado, true);

    await pool.query(
      "UPDATE items SET nombre = ?, descripcion = ?, estado = ? WHERE id = ?",
      [nombre, descripcion || null, itemEstado, id]
    );

    res.json({
      mensaje: "Item actualizado correctamente",
      item: {
        id: Number(id),
        nombre,
        descripcion: descripcion || null,
        estado: itemEstado
      }
    });
  } catch (error) {
    next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM items WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Item no encontrado" });
    }

    res.json({ mensaje: "Item eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/authRoutes");
const itemRoutes = require("./src/routes/itemRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensaje: "API funcionando" });
});

app.use("/", authRoutes);
app.use("/api/items", itemRoutes);

app.use((req, res) => {
  res.status(404).json({ mensaje: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    mensaje: err.message || "Error interno del servidor"
  });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
});

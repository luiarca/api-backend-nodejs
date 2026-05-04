require("dotenv").config();

const express = require("express");
const cors = require("cors");

const bootstrap = require("./src/config/bootstrap");
const authRoutes = require("./src/routes/authRoutes");
const itemRoutes = require("./src/routes/itemRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensaje: "API funcionando" });
});

app.use("/", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({ mensaje: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    mensaje: err.message || "Error interno del servidor"
  });
});

app.listen(PORT, async () => {
  console.log(`Servidor ejecutandose en http://localhost:${PORT}`);

  try {
    await bootstrap();
    console.log("Bootstrap de base de datos completado");
  } catch (error) {
    console.error("Bootstrap omitido por error:", error.message);
  }
});

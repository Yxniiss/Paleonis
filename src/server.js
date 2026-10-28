require("dotenv").config();
const pool = require("./config/db");

const express = require("express");
const app = express();

pool.query("SELECT NOW()")
    .then(() => {
        console.log("Connecté à PostgreSQL !");
    })
    .catch((erreur) => {
        console.error("Erreur de connexion :", erreur.message);
    });

const productRoutes = require("./routes/product.routes");
const dashboardRoutes = require("./routes/dashboard.routes");   // ← ajouté

app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/dashboard", dashboardRoutes);                      // ← ajouté

// Le 404 reste TOUJOURS en dernier
app.use((req, res) => {
    res.status(404).json({ message: "Page introuvable" });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Serveur lance sur le port 3000");
});
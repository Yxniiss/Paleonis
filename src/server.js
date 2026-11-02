require("dotenv").config();
const pool = require("./config/db");
const connectMongo = require("./config/mongo");

const express = require("express");
const app = express();

const productRoutes = require("./routes/product.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const datacenterRoutes = require("./routes/datacenterRoutes");
const technicienRoutes = require("./routes/technicienRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const offreRoutes = require("./routes/offreRoutes");
const serveurRoutes = require("./routes/serveurRoutes");
const ficheTechniqueRoutes = require("./routes/ficheTechniqueRoutes");
const evenementServeur = require("./routes/evenementServeurRoute");
const messageTicketRoutes = require("./routes/messageTicketRoute");

app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/dashboard", dashboardRoutes); 
app.use("/api/datacenters", datacenterRoutes);
app.use("/api/technicians", technicienRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/catalog", offreRoutes);
app.use("/api/servers", serveurRoutes);
app.use("/api/ficheTechnique", ficheTechniqueRoutes);
app.use("/api/evenementServeur", evenementServeur);
app.use("/api/messageTicket", messageTicketRoutes);

// Le 404 reste TOUJOURS en dernier
app.use((req, res) => {
    res.status(404).json({ message: "Page introuvable" });
});

async function startServer() {
    try {
        await pool.query("SELECT NOW()");
        console.log("Connecté à PostgreSQL !");

        await connectMongo();

        app.listen(process.env.PORT || 3000, () => {
            console.log("Serveur lancé sur le port 3000");
        });
    } catch (erreur) {
        console.error("Erreur au démarrage :", erreur.message);
        process.exit(1);
    }
}

startServer();
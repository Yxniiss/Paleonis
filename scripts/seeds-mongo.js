
require("dotenv").config();

const mongoose = require("mongoose");

const pool = require("../src/config/db");
const connectMongo = require("../src/config/mongo");

const EvenementServeur = require("../src/models/EvenementServeur");
const FicheTechnique = require("../src/models/FicheTechnique");

async function seedMongo() {
    try {
        // 1. Connexion à MongoDB
        await connectMongo();

        console.log("Connexion MongoDB réussie");

        // 2. Récupération des serveurs PostgreSQL
        const serveurs = await pool.query(
            "SELECT id_serveur FROM public.serveur"
        );

        // 3. Récupération des offres PostgreSQL
        const offres = await pool.query(
            "SELECT id_offre FROM public.offre"
        );

        console.log("Nombre de serveurs :", serveurs.rows.length);
        console.log("Nombre d'offres :", offres.rows.length);

        // Vérifier que les données PostgreSQL existent
        if (serveurs.rows.length === 0) {
            throw new Error("Aucun serveur trouvé dans PostgreSQL");
        }

        if (offres.rows.length === 0) {
            throw new Error("Aucune offre trouvée dans PostgreSQL");
        }

        // 4. Vider les anciennes collections MongoDB
        await EvenementServeur.deleteMany({});
        await FicheTechnique.deleteMany({});

        console.log("Anciennes données supprimées");

        // 5. Préparer les événements
        const types = [
            "redemarrage",
            "alerte",
            "maintenance",
            "metrique"
        ];

        const evenements = [];

        for (let i = 0; i < 50; i++) {

            // Répartir les événements sur les serveurs
            const serveur = serveurs.rows[i % serveurs.rows.length];

            // Alterner les types d'événements
            const type = types[i % types.length];

            // Répartir les événements sur 15 jours
            const date = new Date();
            date.setDate(date.getDate() - (i % 15));

            let donnees;

            // Données propres à chaque type
            switch (type) {

                case "redemarrage":
                    donnees = {
                        raison: "Mise à jour système"
                    };
                    break;

                case "alerte":
                    donnees = {
                        niveau: "critique",
                        message: "Température élevée du serveur"
                    };
                    break;

                case "maintenance":
                    donnees = {
                        description: "Maintenance préventive",
                        technicien: "Technicien " + (i + 1)
                    };
                    break;

                case "metrique":
                    donnees = {
                        cpu: 30 + (i % 70),
                        ram: 40 + (i % 60),
                        disque: 20 + (i % 80)
                    };
                    break;
            }

            evenements.push({
                serveurId: serveur.id_serveur,
                type: type,
                date: date,
                donnees: donnees
            });
        }

        // 6. Insérer les 50 événements dans MongoDB
        await EvenementServeur.insertMany(evenements);

        console.log("50 événements insérés");

        // 7. Préparer les fiches techniques
        const categories = [
            "VPS",
            "NOM_DE_DOMAINE",
            "SERVEUR_DEDIE"
        ];

        const fiches = offres.rows.map((offre, index) => {

            const categorie = categories[index % categories.length];

            let caracteristiques;

            switch (categorie) {

                case "VPS":
                    caracteristiques = {
                        processeur: "4 vCPU",
                        ram: "8 Go",
                        stockage: "100 Go SSD"
                    };
                    break;

                case "NOM_DE_DOMAINE":
                    caracteristiques = {
                        extension: ".fr",
                        renouvellement: "Annuel",
                        dns: true
                    };
                    break;

                case "SERVEUR_DEDIE":
                    caracteristiques = {
                        processeur: "Intel Xeon",
                        ram: "32 Go",
                        stockage: "1 To SSD"
                    };
                    break;
            }

            return {
                offreId: offre.id_offre,
                categorie: categorie,
                caracteristiques: caracteristiques
            };
        });

        // 8. Insérer les fiches techniques
        await FicheTechnique.insertMany(fiches);

        console.log(fiches.length + " fiches techniques insérées");

        console.log("Seeding MongoDB terminé avec succès !");

    } catch (erreur) {
        console.error("Erreur pendant le seeding :", erreur);
        process.exitCode = 1;

    } finally {
        // 9. Fermer les connexions
        await pool.end();
        await mongoose.disconnect();

        console.log("Connexions fermées");
    }
}

// Exécuter le script
seedMongo();

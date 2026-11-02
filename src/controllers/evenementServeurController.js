const EvenementServeur = require("../models/EvenementServeur");
const pool = require("../config/db");

async function creerEvenement(req, res) {
    try {
        const id = req.params.serveurId;
        const type_evenement = req.body.type;
        const date = req.body.date;
        const donnees = req.body.donnees;
        const typesAutorises = ["redemarrage", "alerte", "maintenance", "metrique"];


        if(!donnees || typeof donnees !== "object" || Array.isArray(donnees)){
            return res.status(400).json({ erreur: "Les données de l'événement sont invalides" }); 
        }

        if (!typesAutorises.includes(type_evenement)) {
            return res.status(400).json({erreur: "Type d'événement invalide"});
        }

        if (type_evenement === 'metrique'){
            if(typeof donnees.cpu !== "number" || typeof donnees.ram !== "number" || typeof donnees.disque !== "number"){
                return res.status(400).json({ erreur: "Les métriques CPU, RAM et disque doivent être des nombres" });
            }
        }

        if (type_evenement === 'alerte'){
            if(!donnees.niveau || !donnees.message){
                return res.status(400).json({ erreur: "Une alerte doit contenir un niveau et un message" });
            }
        }

        if (type_evenement === 'maintenance'){
            if(!donnees.description  || !donnees.technicien){
                return res.status(400).json({ erreur: "Une maintenance doit contenir une description et un technicien" });
            }
        }

        if(type_evenement === 'redemarrage'){
            if(!donnees.raison){
                return res.status(400).json({ erreur: "Un redémarrage doit contenir une raison" });
            }
        }

        const result = await pool.query(
            "SELECT * FROM public.serveur WHERE id_serveur=$1",
            [id],
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ erreur: "Aucun serveur trouvé" });
        }

        const evenement = await EvenementServeur.create({
            serveurId: Number(id),
            type: type_evenement,
            date: date || new Date(),
            donnees: donnees
        });

        return res.status(201).json({
            message: "Événement créé",
            evenement: evenement
        });

    } catch (erreur) {
        console.error(erreur);
        return res.status(500).json({ erreur: "Erreur serveur" });
    }
}

async function getAllEvenement(req, res) {
    try {
        const id = req.params.serveurId;

        const result = await pool.query(
            "SELECT * FROM public.serveur WHERE id_serveur=$1",
            [id],
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ erreur: "Aucun serveur trouvé" });
        }

        const filtre = { serveurId: Number(id) };

        const type = req.query.type;
        if (type) {
            filtre.type = type;
        }

        const date_debut = req.query.date_debut;
        const date_fin = req.query.date_fin;
        const limite = req.query.limit;

        if (date_debut && date_fin) {
            const debut = new Date(date_debut);
            const fin = new Date(date_fin);
            fin.setDate(fin.getDate() + 1);

            filtre.date = {
                $gte: debut,
                $lt: fin
            };
        }

        const event = await EvenementServeur
            .find(filtre)
            .sort({ date: -1 })
            .limit(Number(limite) || 50);

        return res.status(200).json({
            message: "Événements bien récupérés",
            evenement: event
        });

    } catch (erreur) {
        console.error(erreur);
        return res.status(500).json({ erreur: "Erreur serveur" });
    }
}

// Statistiques des événements d'un serveur
async function getStatistiquesEvenement(req, res) {
    try {
        const id = req.params.serveurId;

        // Vérifier que le serveur existe dans PostgreSQL
        const result = await pool.query(
            "SELECT * FROM public.serveur WHERE id_serveur=$1",
            [id],
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ erreur: "Aucun serveur trouvé" });
        }

        // Compter les événements par type dans MongoDB
        const statistiques = await EvenementServeur.aggregate([
            {
                $match: {
                    serveurId: Number(id)
                }
            },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: 1 }
                }
            }
        ]);

        return res.status(200).json({
            message: "Statistiques récupérées",
            statistiques: statistiques
        });

    } catch (erreur) {
        console.error(erreur);
        return res.status(500).json({ erreur: "Erreur serveur" });
    }
}

module.exports = {
    creerEvenement,
    getAllEvenement,
    getStatistiquesEvenement
};

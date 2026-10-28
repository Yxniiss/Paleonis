const Offre = require("../models/Offre");

class OffreController {
    static async getAll(req, res){
        try{
           const offres = await Offre.findAll();
            res.json(offres); 
        } catch(erreur){
            res.status(500).json({ erreur: "Erreur serveur" })
        }
    }

    static async getById(req, res){
        try{
            const id = req.params.id;
            const offres = await Offre.findById(id);
            if(!offres){
                return res.status(404).json({ erreur: "Offre introuvable" });
            }
            res.json(offres)
        } catch(erreur){
            res.status(500).json({ erreur: "Erreur serveur" })
        }
    }

    static async create(req, res){
        try{
            const donnees = req.body;
            const offres = await Offre.create(donnees);
            res.status(201).json(offres);
        }catch(erreur){
            res.status(500).json({ erreur: "Erreur serveur" });
        }
    }

    static async update(req, res){
        try{
            const id = req.params.id;
            const donnees = req.body;
            const offres = await Offre.update(id,donnees);
            if(!offres){
                return res.status(404).json({ erreur: "Offre introuvable" });
            }
            res.json(offres)
        }catch(erreur){
            res.status(500).json({ erreur: "Erreur serveur" });
        }
    }

    static async delete(req, res){
        try{
            const id = req.params.id;
            const offres = await Offre.delete(id);
            if(!offres){
                return res.status(404).json({ erreur: "Offre introuvable" });
            }
            res.status(200).json({message: "Supprimée avec succès"});
        }catch(error){
            res.status(500).json({ erreur: "Erreur serveur" });
        }
    }
}

module.exports = OffreController;
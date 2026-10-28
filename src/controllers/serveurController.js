const Serveur = require("../models/Serveur");

class ServeurController {
    // GET /api/servers?datacenter=1&statut=en service&libre=true
    static async getAll(req, res){
        try{
            const { datacenter, statut, libre } = req.query;
            const Serveurs = await Serveur.findAll({
                idDatacenter: datacenter ? Number(datacenter) : null,
                statut: statut || null,
                libre: libre === "true" ? true : libre === "false" ? false : null,
            });
            res.json(Serveurs); 
        } catch(erreur){
            res.status(500).json({ erreur: "Erreur serveur" })
        }
    }

    static async getById(req, res){
        try{
            const id = req.params.id;
            const Serveurs = await Serveur.findById(id);
            if(!Serveurs){
                return res.status(404).json({ erreur: "Serveur introuvable" });
            }
            res.json(Serveurs)
        } catch(erreur){
            res.status(500).json({ erreur: "Erreur serveur" })
        }
    }

    static async create(req, res){
        try{
            const donnees = req.body;
            const Serveurs = await Serveur.create(donnees);
            res.status(201).json(Serveurs);
        }catch(erreur){
            res.status(500).json({ erreur: "Erreur serveur" });
        }
    }

    static async update(req, res){
        try{
            const id = req.params.id;
            const donnees = req.body;
            const Serveurs = await Serveur.update(id,donnees);
            if(!Serveurs){
                return res.status(404).json({ erreur: "Serveur introuvable" });
            }
            res.json(Serveurs)
        }catch(erreur){
            res.status(500).json({ erreur: "Erreur serveur" });
        }
    }

    static async delete(req, res){
        try{
            const id = req.params.id;
            const Serveurs = await Serveur.delete(id);
            if(!Serveurs){
                return res.status(404).json({ erreur: "Serveur introuvable" });
            }
            res.status(200).json({message: "Supprimée avec succès"});
        }catch(error){
            res.status(500).json({ erreur: "Erreur serveur" });
        }
    }
}

module.exports = ServeurController;

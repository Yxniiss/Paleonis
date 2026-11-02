const FicheTechnique = require("../models/FicheTechnique");
const pool = require("../config/db");

async function getFicheTechnique(req,res){
    try{
        const id = req.params.offreId; // recupere id dans url 
        const result = await pool.query(
            "SELECT * FROM public.offre WHERE id_offre=$1",
            [id],
        );
        if(result.rows.length === 0){
            return res.status(404).json({ erreur: "aucune offre trouvé",  })
        };

        const fiche = await FicheTechnique.findOne({offreId: Number(id)}) // on récupere la fiche technique
        if(!fiche){
            return res.status(404).json({ erreur: "aucun fichier trouvé"})
        }

        return res.status(200).json({ message:"fiche technique recupéré" , offre: result.rows[0], ficheTechnique: fiche})
    }catch (erreur){
        return res.status(500).json({ erreur: "Erreur serveur",  })
    }
}

async function creerFicheTechnique(req,res){
    try{
        const id = req.params.offreId;
        const categorie = req.body.categorie;
        const caracteristiques = req.body.caracteristiques

        const result = await pool.query(
            "SELECT * FROM public.offre WHERE id_offre=$1",
            [id],
        );
        if(result.rows.length === 0){
            return res.status(404).json({ erreur: "aucune offre trouvé",  })
        };

        const categoriesAutorisees = ["VPS", "NOM_DE_DOMAINE", "SERVEUR_DEDIE"];
        if(categoriesAutorisees.includes(categorie) == false){
            return res.status(400).json({ erreur: "categorie invalide"})
        }

        if(!caracteristiques || typeof caracteristiques !== "object" || Array.isArray(caracteristiques)){
            return res.status(400).json({ erreur: "caracteristiques invalide"})
        }

        const fiche = await FicheTechnique.findOneAndUpdate({offreId: Number(id)}, {categorie:categorie, caracteristiques:caracteristiques}, {new: true, upsert: true, runValidators: true}) // on récupere la fiche technique
        return res.status(200).json({message:"Fiche technique enregistrée",ficheTechnique: fiche})

    } catch(erreur){
        return res.status(500).json({ erreur: "Erreur serveur",  })
    };
}

module.exports = {
    getFicheTechnique,
    creerFicheTechnique
};
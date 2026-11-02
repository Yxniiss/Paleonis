const MessageTicket = require("../models/MessageTicket");
const pool = require("../config/db");

async function ajouterMessage(req,res){
    try{
        const id = req.params.ticketId; // recupere id dans url 
        const message = req.body.message; // recupere message body
        const result = await pool.query(
            "SELECT * FROM public.ticket WHERE id_ticket=$1",
            [id],
        );

        if(result.rows.length === 0){
            return res.status(404).json({ erreur: "aucun ticket trouvé",  })
        };

        const statut = result.rows[0].statut;

        if(statut === "fermé"){
            return res.status(409).json({ erreur: "ticket fermé, impossible d'ajouter un message"})
        };

        const auteurType = req.body.auteurType;
        const auteurId = req.body.auteurId;

        if(!["client", "technicien"].includes(auteurType)){ //.includes vérifie si la valeur est dans le tableau
            return res.status(400).json({ erreur: "type d'auteur invalide"})
        };

        if (auteurType === "technicien") {
            const technicien = await pool.query(
                "SELECT id_technicien FROM public.technicien WHERE id_technicien = $1",
                [auteurId]
            );
            
            if (technicien.rows.length === 0) {
                return res.status(404).json({ erreur: "Technicien introuvable"});
            }
        }

        if (auteurType === "technicien") {
            if (Number(auteurId) != Number(result.rows[0].id_technicien)) {
                return res.status(403).json({ erreur: "Ce technicien n'est pas autorisé à répondre à ce ticket"});
            }
        }

        if (auteurType === "client" && Number(auteurId) !== Number(result.rows[0].id_client)){
            return res.status(403).json({erreur: "Ce client n'est pas autorisé à répondre à ce ticket"});
        }


        if(!message || typeof message !== "string" || message.trim() === ""){
            return res.status(400).json({ erreur: "message invalide"})
        };
        
        const nouveauMessage = await MessageTicket.create({
            ticketId: Number(id),
            auteurType: auteurType,
            auteurId: Number(auteurId),
            contenu: message.trim()
        });
        
        return res.status(201).json({ message: "Message ajouté avec succès", nouveauMessage: nouveauMessage});
    }catch (erreur){
        return res.status(500).json({ erreur: "Erreur serveur",  })
    };
}


async function getMessages(req,res){

    const id = req.params.ticketId; // recupere id dans url
    try{
        const result = await pool.query(
            "SELECT * FROM public.ticket WHERE id_ticket=$1",
            [id],
        );

        if(result.rows.length === 0){
            return res.status(404).json({ erreur: "aucun ticket trouvé",  })
        }

        const message = await MessageTicket.find({ticketId: Number(id)}).sort({dateEnvoi: 1}); // on récupere les messages du ticket et on les trie par date de création croissante
        return res.status(200).json({ message: "Messages récupérés avec succès",ticket: result.rows[0], messages: message});
    }catch (erreur){
        return res.status(500).json({ erreur: "Erreur serveur",  })
    }
}

module.exports = {
    ajouterMessage,
    getMessages
}



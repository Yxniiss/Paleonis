const Ticket = require("../models/Ticket");

// Renvoie l'id sous forme de nombre s'il est valide, sinon null
function lireId(valeur) {
    const id = Number(valeur);
    return Number.isInteger(id) && id > 0 && id <= 2147483647 ? id : null;
}

function estTexteRempli(valeur) {
    return typeof valeur === "string" && valeur.trim() !== "";
}

exports.getTicket = async (req, res) => {
    const id = lireId(req.params.id);

    if (!id) {
        return res.status(400).json({ message: "Id de ticket invalide" });
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
        return res.status(404).json({ message: "Ticket introuvable" });
    }

    res.status(200).json(ticket);
};

exports.createTicket = async (req, res) => {
    const { sujet, description, priorite, id_client, id_serveur } = req.body ?? {};

    if (!estTexteRempli(sujet) || !estTexteRempli(description) || !priorite || id_client === undefined) {
        return res.status(400).json({ message: "Champs obligatoires : sujet, description, priorite, id_client" });
    }

    const idClient = lireId(id_client);
    const idServeur = id_serveur === undefined || id_serveur === null ? null : lireId(id_serveur);

    if (!idClient || (id_serveur !== undefined && id_serveur !== null && !idServeur)) {
        return res.status(400).json({ message: "id_client et id_serveur doivent être des entiers positifs" });
    }

    if (sujet.trim().length > 200) {
        return res.status(422).json({ message: "Le sujet ne doit pas dépasser 200 caractères" });
    }

    if (!Ticket.PRIORITES.includes(priorite)) {
        return res.status(422).json({ message: `Priorité invalide. Valeurs autorisées : ${Ticket.PRIORITES.join(", ")}` });
    }

    if (idServeur && !(await Ticket.serveurAppartientAuClient(idServeur, idClient))) {
        return res.status(422).json({ message: "Ce serveur n'existe pas ou n'appartient pas à ce client" });
    }

    try {
        const ticket = await Ticket.create({
            sujet: sujet.trim(),
            description: description.trim(),
            priorite,
            id_client: idClient,
            id_serveur: idServeur,
        });

        res.status(201).json(ticket);
    } catch (error) {
        // 23503 : clé étrangère vers un client qui n'existe pas
        if (error.code === "23503") {
            return res.status(404).json({ message: "Client introuvable" });
        }
        throw error;
    }
};

exports.assignTicket = async (req, res) => {
    const id = lireId(req.params.id);
    const idTechnicien = lireId((req.body ?? {}).id_technicien);

    if (!id || !idTechnicien) {
        return res.status(400).json({ message: "Id de ticket ou id_technicien invalide" });
    }

    try {
        const ticket = await Ticket.assign(id, idTechnicien);

        if (!ticket) {
            return res.status(404).json({ message: "Ticket introuvable" });
        }

        res.status(200).json(ticket);
    } catch (error) {
        // 23503 : clé étrangère vers un technicien qui n'existe pas
        if (error.code === "23503") {
            return res.status(404).json({ message: "Technicien introuvable" });
        }
        throw error;
    }
};

exports.updateStatutTicket = async (req, res) => {
    const id = lireId(req.params.id);
    const { statut } = req.body ?? {};

    if (!id || !statut) {
        return res.status(400).json({ message: "Id de ticket invalide ou statut manquant" });
    }

    if (!Ticket.STATUTS.includes(statut)) {
        return res.status(422).json({ message: `Statut invalide. Valeurs autorisées : ${Ticket.STATUTS.join(", ")}` });
    }

    const ticket = await Ticket.updateStatut(id, statut);

    if (!ticket) {
        return res.status(404).json({ message: "Ticket introuvable" });
    }

    res.status(200).json(ticket);
};

const Technicien = require("../models/Technicien");
const Ticket = require("../models/Ticket");

// Renvoie l'id sous forme de nombre s'il est valide, sinon null
function lireId(valeur) {
    const id = Number(valeur);
    return Number.isInteger(id) && id > 0 && id <= 2147483647 ? id : null;
}

exports.listTechniciens = async (req, res) => {
    const techniciens = await Technicien.findAll();

    res.status(200).json(techniciens);
};

exports.getTechnicien = async (req, res) => {
    const id = lireId(req.params.id);

    if (!id) {
        return res.status(400).json({ message: "Id de technicien invalide" });
    }

    const technicien = await Technicien.findById(id);

    if (!technicien) {
        return res.status(404).json({ message: "Technicien introuvable" });
    }

    res.status(200).json(technicien);
};

exports.listTicketsTechnicien = async (req, res) => {
    const id = lireId(req.params.id);

    if (!id) {
        return res.status(400).json({ message: "Id de technicien invalide" });
    }

    const technicien = await Technicien.findById(id);

    if (!technicien) {
        return res.status(404).json({ message: "Technicien introuvable" });
    }

    const tickets = await Ticket.findNonFermesByTechnicien(id);

    res.status(200).json(tickets);
};

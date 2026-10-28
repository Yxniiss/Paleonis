const Datacenter = require("../models/Datacenter");

// Renvoie l'id sous forme de nombre s'il est valide, sinon null
function lireId(valeur) {
    const id = Number(valeur);
    return Number.isInteger(id) && id > 0 && id <= 2147483647 ? id : null;
}

exports.listDatacenters = async (req, res) => {
    const datacenters = await Datacenter.findAll();

    res.status(200).json(datacenters);
};

exports.getDatacenter = async (req, res) => {
    const id = lireId(req.params.id);

    if (!id) {
        return res.status(400).json({ message: "Id de datacenter invalide" });
    }

    const datacenter = await Datacenter.findById(id);

    if (!datacenter) {
        return res.status(404).json({ message: "Datacenter introuvable" });
    }

    res.status(200).json(datacenter);
};

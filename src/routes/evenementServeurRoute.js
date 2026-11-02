const router = require("express").Router();

const EvenementServeur = require("../controllers/evenementServeurController.js");

router.post("/:serveurId", EvenementServeur.creerEvenement);
router.get("/:serveurId", EvenementServeur.getAllEvenement);
router.get("/:serveurId/statistiques", EvenementServeur.getStatistiquesEvenement);


console.log("Route événements chargée");

module.exports = router;
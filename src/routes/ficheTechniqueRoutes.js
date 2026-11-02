const router = require("express").Router();

const ficheTechniqueController = require("../controllers/ficheTechniqueController");

router.get("/:offreId", ficheTechniqueController.getFicheTechnique);
router.post("/:offreId", ficheTechniqueController.creerFicheTechnique);

module.exports = router;
const router = require("express").Router();

const technicienController = require("../controllers/technicienController");

router.get("/", technicienController.listTechniciens);
router.get("/:id", technicienController.getTechnicien);
router.get("/:id/tickets", technicienController.listTicketsTechnicien);

module.exports = router;

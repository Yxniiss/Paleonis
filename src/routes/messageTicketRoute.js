const router = require("express").Router();

const messageTicketController = require("../controllers/messageTicketController.js");

router.post("/:ticketId/messages", messageTicketController.ajouterMessage);
router.get("/:ticketId/conversation", messageTicketController.getMessages);

module.exports = router;

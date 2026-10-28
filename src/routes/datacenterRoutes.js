const router = require("express").Router();

const datacenterController = require("../controllers/datacenterController");

router.get("/", datacenterController.listDatacenters);
router.get("/:id", datacenterController.getDatacenter);

module.exports = router;

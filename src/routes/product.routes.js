
const router = require("express").Router();

const productController = require("../controllers/product.controller");

router.get("/", productController.listProducts);
router.get("/:id", productController.getProduct);
router.post("/", productController.createProduct);

module.exports = router;

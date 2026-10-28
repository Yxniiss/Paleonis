
const Product = require("../models/product.model");

exports.listProducts = (req, res) => {
    const products = Product.findAll();

    res.status(200).json(products);
};

exports.getProduct = (req, res) => {
    const product = Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({ message: "Produit introuvable" });
    }

    res.status(200).json(product);
};

exports.createProduct = (req, res) => {
    try {
        const product = Product.createOne(req.body);

        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

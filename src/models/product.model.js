
class Product {
    #id;
    #name;
    #price;

    static #data = [
        { id: 1, name: "Serveur VPS", price: 20 },
        { id: 2, name: "Nom de domaine", price: 10 },
        { id: 3, name: "Hebergement web", price: 5 }
    ];

    constructor(id, name, price) {
        this.#id = id;
        this.#name = name;
        this.#price = price;
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get price() {
        return this.#price;
    }

    static findAll() {
        return this.#data.map(product => new Product(
            product.id,
            product.name,
            product.price
        ));
    }

    static findById(id) {
        const product = this.#data.find(product => product.id == id);

        if (!product) {
            return null;
        }

        return new Product(product.id, product.name, product.price);
    }

    static createOne(dto) {
        if (!dto || typeof dto.name !== "string" || dto.name.trim() === "") {
            throw new Error("Le nom est obligatoire.");
        }

        if (typeof dto.price !== "number" || dto.price < 0 || !Number.isFinite(dto.price)) {
            throw new Error("Le prix doit être positif ou nul.");
        }

        const product = new Product(
            this.#data.length + 1,
            dto.name,
            dto.price
        );

        this.#data.push({
            id: product.id,
            name: product.name,
            price: product.price
        });

        return product;
    }
}

module.exports = Product;

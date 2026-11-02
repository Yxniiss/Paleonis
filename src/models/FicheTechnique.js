
const { Schema, model } = require("mongoose");

const ficheTechniqueSchema = new Schema(
    {
        offreId: {
            type: Number,
            required: true
        },

        categorie: {
            type: String,
            required: true,
            enum: ["VPS", "NOM_DE_DOMAINE", "SERVEUR_DEDIE"]
        },

        caracteristiques: {
            type: Schema.Types.Mixed,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = model(
    "FicheTechnique",
    ficheTechniqueSchema,
    "fiches_techniques"
);


const { Schema, model } = require("mongoose");

const evenementServeurSchema= new Schema(
    {
        serveurId: {
            type: Number,
            required: true,
            index: true //facilite les recherches par serveur et par date
        },

        type: {
            type: String,
            required: true,
            enum: ["redemarrage", "alerte", "maintenance", "metrique"]
        },

        date: {
            type: Date,
            required: true,
            index: true
        },

        donnees: {
           type : Schema.Types.Mixed,
           required:true
        }
    },
    {
        timestamps: true //ajoute automatiquement deux dates à chaque document MongoDB.
    }
);

module.exports = model(
    "EvenementServeurs",  //Le nom du modèle Mongoose que tu vas utiliser dans ton code.
    evenementServeurSchema, //Le schéma qui définit la structure de tes données.
    "evenement_serveur" //Le nom exact de la collection dans MongoDB.
);

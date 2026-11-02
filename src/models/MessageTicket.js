
const { Schema, model } = require("mongoose");

const messageTicketSchema = new Schema(
    {
        ticketId: {
            type: Number,
            required: true,
            index: true
        },

        auteurType: {
            type: String,
            required: true,
            enum: ["client", "technicien"]
        },

        auteurId: {
            type: Number,
            required: true
        },

        contenu: {
            type: String,
            required: true,
            trim: true
        },

        dateEnvoi: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = model(
    "MessageTicket",
    messageTicketSchema,
    "messages_tickets"
);

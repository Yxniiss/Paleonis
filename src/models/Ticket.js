const pool = require("../config/db");

const COLONNES = "id_ticket, sujet, description, date_ouverture, priorite, statut, id_client, id_serveur, id_technicien";

class Ticket {
    static PRIORITES = ["basse", "normale", "haute", "critique"];
    static STATUTS = ["ouvert", "en cours", "resolu", "ferme"];

    static async findById(id) {
        const { rows } = await pool.query(
            `SELECT ${COLONNES} FROM ticket WHERE id_ticket = $1`,
            [id]
        );
        return rows[0] ?? null;
    }

    // B8 : tickets non fermés d'un technicien, du plus critique au moins critique
    static async findNonFermesByTechnicien(idTechnicien) {
        const { rows } = await pool.query(
            `SELECT ${COLONNES} FROM ticket
             WHERE id_technicien = $1 AND statut <> 'ferme'
             ORDER BY CASE priorite
                        WHEN 'critique' THEN 1
                        WHEN 'haute' THEN 2
                        WHEN 'normale' THEN 3
                        ELSE 4
                      END,
                      date_ouverture`,
            [idTechnicien]
        );
        return rows;
    }

    // RG6 : un ticket ne peut concerner qu'un serveur du client
    static async serveurAppartientAuClient(idServeur, idClient) {
        const { rows } = await pool.query(
            "SELECT 1 FROM abonnement WHERE id_serveur = $1 AND id_client = $2",
            [idServeur, idClient]
        );
        return rows.length > 0;
    }

    static async create({ sujet, description, priorite, id_client, id_serveur }) {
        const { rows } = await pool.query(
            `INSERT INTO ticket (sujet, description, priorite, id_client, id_serveur)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING ${COLONNES}`,
            [sujet, description, priorite, id_client, id_serveur ?? null]
        );
        return rows[0];
    }

    static async assign(id, idTechnicien) {
        const { rows } = await pool.query(
            `UPDATE ticket SET id_technicien = $2 WHERE id_ticket = $1 RETURNING ${COLONNES}`,
            [id, idTechnicien]
        );
        return rows[0] ?? null;
    }

    static async updateStatut(id, statut) {
        const { rows } = await pool.query(
            `UPDATE ticket SET statut = $2 WHERE id_ticket = $1 RETURNING ${COLONNES}`,
            [id, statut]
        );
        return rows[0] ?? null;
    }
}

module.exports = Ticket;

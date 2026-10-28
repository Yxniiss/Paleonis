const pool = require("../config/db");

const COLONNES = "id_technicien, nom, prenom, email_professionnel, id_datacenter";

class Technicien {
    static async findAll() {
        const { rows } = await pool.query(
            `SELECT ${COLONNES} FROM technicien ORDER BY nom, prenom`
        );
        return rows;
    }

    static async findById(id) {
        const { rows } = await pool.query(
            `SELECT ${COLONNES} FROM technicien WHERE id_technicien = $1`,
            [id]
        );
        return rows[0] ?? null;
    }
}

module.exports = Technicien;

const pool = require("../config/db"); // importer connexion bdd

class Serveur {
    static async findAll() {
        const resultat = await pool.query( // pool nom de la variable
            "SELECT * FROM public.serveur ORDER BY id_serveur" //
        );

        return resultat.rows; // rows contient les lignes recuperer par la bdd
    }

    static async findById(id){
        const resultat = await pool.query(
            "SELECT * FROM public.serveur WHERE id_serveur=$1",
            [id]
        );
        return resultat.rows[0];
    }

    static async create(donnees){
        const resultat = await pool.query(
            "INSERT INTO public.serveur (nom_hote,adresse_ip,statut,date_mise_en_service,id_datacenter) VALUES($1,$2,$3,$4,$5) RETURNING*",
            [
            donnees.nom_hote,
            donnees.adresse_ip,
            donnees.statut,
            donnees.date_mise_en_service,
            donnees.id_datacenter
            ]
        );
        return resultat.rows[0];
    }

    static async update(id,donnees){
        const resultat = await pool.query(
            "Update public.serveur SET nom_hote = $1, adresse_ip = $2, statut= $3, date_mise_en_service = $4, id_datacenter= $5  WHERE id_serveur = $6 RETURNING*",
            [
            donnees.nom_hote,
            donnees.adresse_ip,
            donnees.statut,
            donnees.date_mise_en_service,
            donnees.id_datacenter,
            id
            ],
        )
        return resultat.rows[0];
    }

    static async delete(id){
        const resultat = await pool.query(
            "DELETE FROM public.serveur WHERE id_serveur = $1 RETURNING*",
            [id],
        )
        return resultat.rows[0];
    }



}

module.exports = Serveur;

const pool = require("../config/db"); // importer connexion bdd

class Offre {
    static async findAll() {
        const resultat = await pool.query( // pool nom de la variable
            "SELECT * FROM public.offre ORDER BY id_offre" //
        );

        return resultat.rows; // rows contient les lignes recuperer par la bdd
    }

    static async findById(id){
        const resultat = await pool.query(
            "SELECT * FROM public.offre WHERE id_offre=$1",
            [id]
        );
        return resultat.rows[0];
    }

    static async create(donnees){
        const resultat = await pool.query(
            "INSERT INTO public.offre (donnees.nom,donnees.categorie,donnees.prix_mensuel_ht,donnees.en_vente) VALUES($1,$2,$3,$4) RETURNING*",
    )
    return resultat.rows[0];
    }

    static async update(id,donnees){
        const resultat = await pool.query(
            "Update public.offre SET (nom = $1, categorie = $2, prix_mensuel_ht= $3, en_vente = $4) WHERE id_offre = $5 ) RETURNING*",
            [donnees.nom],
            [donnees.categorie],
            [donnees.prix_mensuel_ht]
            [donnees.en_vente]
        )
        return resultat.rows[0];
    }

}




module.exports = Offre;

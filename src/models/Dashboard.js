const pool = require("../config/db");

class Dashboard {
  static async chiffreAffaires() {
    const [total, parCategorie] = await Promise.all([
      pool.query(
        `SELECT COALESCE(SUM(prix_souscription), 0)::float AS ca_total
         FROM abonnement
         WHERE statut = 'actif'`
      ),
      pool.query(
        `SELECT o.categorie,
                COUNT(a.id_abonnement)::int AS nb_abonnements,
                COALESCE(SUM(a.prix_souscription), 0)::float AS ca
         FROM offre o
         LEFT JOIN abonnement a
                ON a.id_offre = o.id_offre AND a.statut = 'actif'
         GROUP BY o.categorie
         ORDER BY ca DESC`
      ),
    ]);
    return {
      total: total.rows[0].ca_total,
      parCategorie: parCategorie.rows,
    };
  }

  static async serveursParDatacenter() {
    const { rows } = await pool.query(
      `SELECT d.id_datacenter, d.nom, s.statut,
              COUNT(s.id_serveur)::int AS nb
       FROM datacenter d
       LEFT JOIN serveur s ON s.id_datacenter = d.id_datacenter
       GROUP BY d.id_datacenter, d.nom, s.statut
       ORDER BY d.nom, s.statut`
    );

    // Regroupe les lignes : un objet par datacenter avec ses statuts
    const map = new Map();
    for (const r of rows) {
      if (!map.has(r.id_datacenter)) {
        map.set(r.id_datacenter, {
          id_datacenter: r.id_datacenter,
          datacenter: r.nom,
          total: 0,
          statuts: {},
        });
      }
      const dc = map.get(r.id_datacenter);
      if (r.statut) {
        dc.statuts[r.statut] = r.nb;
        dc.total += r.nb;
      }
    }
    return [...map.values()];
  }
}

module.exports = Dashboard;
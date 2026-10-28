-- =========================================================
-- PaLeonis : jeu d'essai
-- Script rejouable : il vide les tables et remet les id à 1.
-- À lancer APRÈS schema.sql.
-- =========================================================

TRUNCATE ticket, abonnement, technicien, serveur, offre, client, datacenter RESTART IDENTITY CASCADE;

-- =========================
-- DATACENTERS (id 1 à 3)
-- =========================
INSERT INTO datacenter (nom, ville) VALUES
('PaLeonis Paris-Nord', 'Paris'),        -- 1
('PaLeonis Lyon-Gerland', 'Lyon'),       -- 2
('PaLeonis Marseille-Port', 'Marseille');-- 3

-- =========================
-- TECHNICIENS (id 1 à 4)
-- =========================
INSERT INTO technicien (nom, prenom, email_professionnel, id_datacenter) VALUES
('Martin', 'Lucas', 'lucas.martin@paleonis.fr', 1),   -- 1
('Bernard', 'Chloe', 'chloe.bernard@paleonis.fr', 1), -- 2
('Petit', 'Hugo', 'hugo.petit@paleonis.fr', 2),       -- 3
('Moreau', 'Ines', 'ines.moreau@paleonis.fr', 3);     -- 4

-- =========================
-- OFFRES (id 1 à 8)
-- L'offre 8 est retirée de la vente mais un client l'a encore (RG2).
-- =========================
INSERT INTO offre (nom, categorie, prix_mensuel_ht, en_vente) VALUES
('VPS Starter', 'VPS', 9.99, true),                                -- 1
('VPS Pro', 'VPS', 24.99, true),                                   -- 2
('Mutualise Perso', 'hebergement mutualise', 4.99, true),          -- 3
('Mutualise Business', 'hebergement mutualise', 14.99, true),      -- 4
('Dedie Performance', 'serveur dedie', 89.00, true),               -- 5
('Dedie Entreprise', 'serveur dedie', 149.00, true),               -- 6
('Domaine .fr', 'nom de domaine', 0.99, true),                     -- 7
('VPS Legacy', 'VPS', 7.99, false);                                -- 8

-- =========================
-- CLIENTS (id 1 à 12)
-- Particulier : siret NULL. Entreprise : siret obligatoire.
-- =========================
INSERT INTO client (nom, email, telephone, date_inscription, type_client, denomination_sociale, siret) VALUES
('Durand Sophie', 'sophie.durand@mail.fr', '0612345678', '2024-02-10', 'particulier', NULL, NULL),                   -- 1
('Lefebvre Thomas', 'thomas.lefebvre@mail.fr', NULL, '2024-05-22', 'particulier', NULL, NULL),                       -- 2
('Garnier Paul', 'contact@webagence.fr', '0145678901', '2023-11-03', 'entreprise', 'WebAgence SARL', '41234567800012'), -- 3
('Roux Camille', 'camille.roux@mail.fr', '0698765432', '2025-01-15', 'particulier', NULL, NULL),                     -- 4
('Fontaine Julie', 'julie.fontaine@mail.fr', NULL, '2025-03-08', 'particulier', NULL, NULL),                         -- 5
('Mercier Alain', 'it@logistik-sud.fr', '0491234567', '2023-06-30', 'entreprise', 'Logistik Sud SAS', '52345678900021'), -- 6
('Blanc Nadia', 'nadia.blanc@mail.fr', '0623456789', '2024-09-12', 'particulier', NULL, NULL),                       -- 7
('Chevalier Marc', 'marc.chevalier@mail.fr', NULL, '2024-01-19', 'particulier', NULL, NULL),                         -- 8
('Lambert Eric', 'admin@boulangerie-lambert.fr', '0478123456', '2022-10-05', 'entreprise', 'Boulangerie Lambert', '63456789000034'), -- 9
('Girard Lea', 'lea.girard@mail.fr', '0634567890', '2025-06-01', 'particulier', NULL, NULL),                         -- 10
('Bonnet Yann', 'yann.bonnet@mail.fr', NULL, '2025-02-14', 'particulier', NULL, NULL),                               -- 11
('Faure Isabelle', 'dsi@cabinet-faure.fr', '0156789012', '2025-08-20', 'entreprise', 'Cabinet Faure Avocats', '74567890100045'); -- 12

-- =========================
-- SERVEURS (id 1 à 20)
-- Paris : 1 à 8, Lyon : 9 à 14, Marseille : 15 à 20
-- =========================
INSERT INTO serveur (nom_hote, adresse_ip, statut, date_mise_en_service, id_datacenter) VALUES
('srv-par-01', '10.1.0.1', 'en service', '2022-03-01', 1),   -- 1  attribué
('srv-par-02', '10.1.0.2', 'en service', '2022-03-01', 1),   -- 2  attribué
('srv-par-03', '10.1.0.3', 'maintenance', '2022-09-15', 1),  -- 3  attribué (abonnement suspendu)
('srv-par-04', '10.1.0.4', 'en service', '2023-01-10', 1),   -- 4  attribué
('srv-par-05', '10.1.0.5', 'en service', '2023-01-10', 1),   -- 5  LIBRE
('srv-par-06', '10.1.0.6', 'en service', '2024-04-20', 1),   -- 6  LIBRE
('srv-par-07', '10.1.0.7', 'maintenance', '2024-04-20', 1),  -- 7  libre
('srv-par-08', '10.1.0.8', 'hors service', '2021-05-05', 1), -- 8  libre
('srv-lyo-01', '10.2.0.1', 'en service', '2022-06-01', 2),   -- 9  attribué
('srv-lyo-02', '10.2.0.2', 'en service', '2022-06-01', 2),   -- 10 attribué
('srv-lyo-03', '10.2.0.3', 'en service', '2023-08-12', 2),   -- 11 LIBRE
('srv-lyo-04', '10.2.0.4', 'en service', '2023-08-12', 2),   -- 12 LIBRE
('srv-lyo-05', '10.2.0.5', 'maintenance', '2024-02-02', 2),  -- 13 libre
('srv-lyo-06', '10.2.0.6', 'hors service', '2021-11-30', 2), -- 14 libre
('srv-mrs-01', '10.3.0.1', 'en service', '2023-03-03', 3),   -- 15 attribué
('srv-mrs-02', '10.3.0.2', 'en service', '2023-03-03', 3),   -- 16 attribué
('srv-mrs-03', '10.3.0.3', 'en service', '2024-07-07', 3),   -- 17 attribué
('srv-mrs-04', '10.3.0.4', 'maintenance', '2024-07-07', 3),  -- 18 libre
('srv-mrs-05', '10.3.0.5', 'maintenance', '2025-01-20', 3),  -- 19 libre
('srv-mrs-06', '10.3.0.6', 'hors service', '2021-02-14', 3); -- 20 libre

-- =========================
-- ABONNEMENTS (id 1 à 14)
-- Hébergement = un serveur. Nom de domaine ou résilié = pas de serveur.
-- =========================
INSERT INTO abonnement (date_debut, date_fin, statut, prix_souscription, id_client, id_offre, id_serveur) VALUES
('2024-02-10', NULL, 'actif', 9.99, 1, 1, 1),            -- 1
('2024-05-22', NULL, 'actif', 4.99, 2, 3, 2),            -- 2
('2023-11-03', NULL, 'actif', 89.00, 3, 5, 9),           -- 3
('2025-01-15', NULL, 'actif', 24.99, 4, 2, 10),          -- 4
('2025-03-08', NULL, 'actif', 0.99, 5, 7, NULL),         -- 5  nom de domaine
('2023-06-30', NULL, 'actif', 149.00, 6, 6, 15),         -- 6
('2024-09-12', NULL, 'suspendu', 14.99, 7, 4, 3),        -- 7
('2024-01-19', '2025-12-31', 'resilie', 8.99, 8, 1, NULL), -- 8  résilié, ancien prix
('2022-10-05', NULL, 'actif', 7.99, 9, 8, 16),           -- 9  offre retirée de la vente
('2024-02-10', NULL, 'actif', 0.99, 1, 7, NULL),         -- 10 nom de domaine
('2025-06-01', NULL, 'actif', 22.99, 10, 2, 4),          -- 11 prix inférieur au catalogue actuel
('2025-02-14', '2025-09-30', 'resilie', 4.99, 11, 3, NULL), -- 12 résilié
('2024-01-10', NULL, 'actif', 89.00, 6, 5, 17),          -- 13
('2025-08-20', NULL, 'suspendu', 0.99, 12, 7, NULL);     -- 14 nom de domaine suspendu

-- =========================
-- TICKETS (id 1 à 10) : toutes les priorités et tous les statuts
-- =========================
INSERT INTO ticket (sujet, description, date_ouverture, priorite, statut, id_client, id_serveur, id_technicien) VALUES
('Serveur injoignable', 'Mon VPS ne répond plus depuis ce matin.', '2026-10-27 08:15', 'critique', 'en cours', 1, 1, 1),
('Lenteurs importantes', 'Le site de nos clients est très lent depuis hier.', '2026-10-26 14:30', 'haute', 'ouvert', 3, 9, 3),
('Question sur ma facture', 'Je ne comprends pas le montant de ce mois-ci.', '2026-10-25 10:00', 'basse', 'ouvert', 2, NULL, NULL),
('Disque presque plein', 'Alerte à 95 % sur le disque principal.', '2026-10-10 09:45', 'haute', 'resolu', 6, 15, 4),
('Mise à jour du système', 'Pouvez-vous planifier la mise à jour de l''OS ?', '2026-09-02 16:20', 'normale', 'ferme', 4, 10, 3),
('Abonnement suspendu', 'Pourquoi mon hébergement est-il suspendu ?', '2026-10-20 11:10', 'normale', 'en cours', 7, 3, 2),
('Configuration DNS', 'Mon domaine ne pointe pas vers le bon site.', '2026-10-24 18:05', 'normale', 'ouvert', 5, NULL, 1),
('Certificat SSL expiré', 'Le navigateur affiche une alerte de sécurité.', '2026-10-27 07:50', 'critique', 'ouvert', 9, 16, 4),
('Demande de redémarrage', 'Merci de redémarrer le serveur ce soir.', '2026-08-14 20:00', 'basse', 'ferme', 10, 4, 1),
('Accès SSH refusé', 'Ma clé SSH n''est plus acceptée.', '2026-10-01 13:25', 'haute', 'resolu', 1, 1, 2);
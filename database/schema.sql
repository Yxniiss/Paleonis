-- =========================================================
-- PaLeonis : schéma de la base
-- Script rejouable : il supprime les tables puis les recrée.
-- ATTENTION : le relancer efface toutes les données.
-- =========================================================

DROP TABLE IF EXISTS ticket, abonnement, technicien, serveur, offre, client, datacenter CASCADE;

-- =========================
-- TABLES
-- =========================

CREATE TABLE datacenter (
    id_datacenter integer GENERATED ALWAYS AS IDENTITY,
    nom varchar(100) NOT NULL,
    ville varchar(100) NOT NULL,
    CONSTRAINT datacenter_pkey PRIMARY KEY (id_datacenter)
);

CREATE TABLE client (
    id_client integer GENERATED ALWAYS AS IDENTITY,
    nom varchar(150) NOT NULL,
    email varchar(254) NOT NULL,
    telephone varchar(30),
    date_inscription date NOT NULL DEFAULT CURRENT_DATE,
    type_client varchar(20) NOT NULL,
    denomination_sociale varchar(200),
    siret varchar(14),
    CONSTRAINT client_pkey PRIMARY KEY (id_client),
    CONSTRAINT client_email_key UNIQUE (email),
    CONSTRAINT client_type_client_check CHECK (type_client IN ('particulier', 'entreprise')),
    CONSTRAINT client_check CHECK (
        (type_client = 'entreprise' AND siret IS NOT NULL)
        OR (type_client = 'particulier' AND siret IS NULL)
    )
);

CREATE TABLE offre (
    id_offre integer GENERATED ALWAYS AS IDENTITY,
    nom varchar(150) NOT NULL,
    categorie varchar(40) NOT NULL,
    prix_mensuel_ht numeric(10,2) NOT NULL,
    en_vente boolean NOT NULL DEFAULT true,
    CONSTRAINT offre_pkey PRIMARY KEY (id_offre),
    CONSTRAINT offre_categorie_check CHECK (categorie IN ('VPS', 'hebergement mutualise', 'serveur dedie', 'nom de domaine')),
    CONSTRAINT offre_prix_mensuel_ht_check CHECK (prix_mensuel_ht >= 0)
);

CREATE TABLE serveur (
    id_serveur integer GENERATED ALWAYS AS IDENTITY,
    nom_hote varchar(255) NOT NULL,
    adresse_ip inet NOT NULL,
    statut varchar(20) NOT NULL,
    date_mise_en_service date NOT NULL,
    id_datacenter integer NOT NULL,
    CONSTRAINT serveur_pkey PRIMARY KEY (id_serveur),
    CONSTRAINT serveur_nom_hote_key UNIQUE (nom_hote),
    CONSTRAINT serveur_adresse_ip_key UNIQUE (adresse_ip),
    CONSTRAINT serveur_statut_check CHECK (statut IN ('en service', 'maintenance', 'hors service')),
    CONSTRAINT serveur_id_datacenter_fkey FOREIGN KEY (id_datacenter) REFERENCES datacenter(id_datacenter) ON DELETE RESTRICT
);

CREATE TABLE abonnement (
    id_abonnement integer GENERATED ALWAYS AS IDENTITY,
    date_debut date NOT NULL DEFAULT CURRENT_DATE,
    date_fin date,
    statut varchar(20) NOT NULL,
    prix_souscription numeric(10,2) NOT NULL,
    id_client integer NOT NULL,
    id_offre integer NOT NULL,
    id_serveur integer,
    CONSTRAINT abonnement_pkey PRIMARY KEY (id_abonnement),
    CONSTRAINT abonnement_id_serveur_key UNIQUE (id_serveur),
    CONSTRAINT abonnement_check CHECK (date_fin IS NULL OR date_fin >= date_debut),
    CONSTRAINT abonnement_prix_souscription_check CHECK (prix_souscription >= 0),
    CONSTRAINT abonnement_statut_check CHECK (statut IN ('actif', 'suspendu', 'resilie')),
    CONSTRAINT abonnement_id_client_fkey FOREIGN KEY (id_client) REFERENCES client(id_client) ON DELETE RESTRICT,
    CONSTRAINT abonnement_id_offre_fkey FOREIGN KEY (id_offre) REFERENCES offre(id_offre) ON DELETE RESTRICT,
    CONSTRAINT abonnement_id_serveur_fkey FOREIGN KEY (id_serveur) REFERENCES serveur(id_serveur) ON DELETE RESTRICT
);

CREATE TABLE technicien (
    id_technicien integer GENERATED ALWAYS AS IDENTITY,
    nom varchar(100) NOT NULL,
    prenom varchar(100) NOT NULL,
    email_professionnel varchar(254) NOT NULL,
    id_datacenter integer NOT NULL,
    CONSTRAINT technicien_pkey PRIMARY KEY (id_technicien),
    CONSTRAINT technicien_email_professionnel_key UNIQUE (email_professionnel),
    CONSTRAINT technicien_id_datacenter_fkey FOREIGN KEY (id_datacenter) REFERENCES datacenter(id_datacenter) ON DELETE RESTRICT
);

CREATE TABLE ticket (
    id_ticket integer GENERATED ALWAYS AS IDENTITY,
    sujet varchar(200) NOT NULL,
    description text NOT NULL,
    date_ouverture timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    priorite varchar(20) NOT NULL,
    statut varchar(20) NOT NULL DEFAULT 'ouvert',
    id_client integer NOT NULL,
    id_serveur integer,
    id_technicien integer,
    CONSTRAINT ticket_pkey PRIMARY KEY (id_ticket),
    CONSTRAINT ticket_priorite_check CHECK (priorite IN ('basse', 'normale', 'haute', 'critique')),
    CONSTRAINT ticket_statut_check CHECK (statut IN ('ouvert', 'en cours', 'resolu', 'ferme')),
    CONSTRAINT ticket_id_client_fkey FOREIGN KEY (id_client) REFERENCES client(id_client) ON DELETE RESTRICT,
    CONSTRAINT ticket_id_serveur_fkey FOREIGN KEY (id_serveur) REFERENCES serveur(id_serveur) ON DELETE SET NULL,
    CONSTRAINT ticket_id_technicien_fkey FOREIGN KEY (id_technicien) REFERENCES technicien(id_technicien) ON DELETE SET NULL
);

-- =========================
-- INDEX
-- =========================

CREATE INDEX idx_abonnement_client ON abonnement (id_client);
CREATE INDEX idx_abonnement_offre ON abonnement (id_offre);
CREATE INDEX idx_serveur_datacenter_statut ON serveur (id_datacenter, statut);
CREATE INDEX idx_ticket_client ON ticket (id_client);
CREATE INDEX idx_ticket_technicien_statut ON ticket (id_technicien, statut);
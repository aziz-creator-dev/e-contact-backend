const db = require('../config/db');
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

// ✅ Ajouter un fournisseur
exports.addFournisseur = (req, res) => {
  const { nom, email, tel, pays, ville, adresse, categorie, rating, image_url, user_id } = req.body;

  const adresseSql = `
    INSERT INTO adress (pays, ville, adresse)
    VALUES (?, ?, ?)
  `;

  db.query(adresseSql, [pays, ville, adresse], (err, adresseResult) => {
    if (err) {
      console.error("Erreur insertion adresse fournisseur:", err);
      return res.status(500).json({ error: "Erreur insertion adresse fournisseur" });
    }

    const ida_f = adresseResult.insertId; // ID de la nouvelle adresse

    const fournisseurSql = `
      INSERT INTO fournisseur (nom, email, tel, categorie, rating, ida_f, image_url, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(fournisseurSql, [nom, email, tel, categorie, rating, ida_f, image_url, user_id], (err, result) => {
      if (err) {
        console.error("Erreur insertion fournisseur:", err);
        return res.status(500).json({ error: "Erreur insertion fournisseur" });
      }

      res.status(201).json({
        message: "Fournisseur et adresse ajoutés avec succès",
        id_fournisseur: result.insertId,
        id_adresse: ida_f
      });
    });
  });
};


// ✅ Obtenir les fournisseurs selon user_id
exports.getFournisseurs = (req, res) => {
  const user_id = req.query.user_id;

  if (!user_id) {
    return res.status(400).json({ error: "user_id manquant" });
  }

  const sql = `SELECT * FROM fournisseur WHERE user_id = ?`;

  db.query(sql, [user_id], (err, result) => {
    if (err) {
      console.error("Erreur récupération fournisseurs:", err);
      return res.status(500).json({ error: "Erreur récupération fournisseurs" });
    }
    res.status(200).json(result);
  });
};

// ✅ Supprimer un fournisseur
exports.deleteFournisseur = (req, res) => {
  const { idf } = req.params;
  const user_id = req.query.user_id;

  if (!user_id) return res.status(400).json({ error: "user_id manquant" });

  const sql = `DELETE FROM fournisseur WHERE idf = ? AND user_id = ?`;

  db.query(sql, [idf, user_id], (err, result) => {
    if (err) {
      console.error("Erreur suppression fournisseur:", err);
      return res.status(500).json({ error: "Erreur suppression fournisseur" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Fournisseur non trouvé ou pas accessible" });
    }

    res.status(200).json({ message: "Fournisseur supprimé avec succès" });
  });
};

// ✅ Mettre à jour un fournisseur
exports.updateFournisseur = (req, res) => {
  const { idf } = req.params;
  const { nom, email, tel, categorie, rating, ida_f, image_url, user_id } = req.body;
 
  if (!user_id) return res.status(400).json({ error: "user_id manquant" });

  const sql = `
    UPDATE fournisseur
    SET nom = ?, email = ?, tel = ?, categorie = ?, rating = ?, ida_f = ?, image_url = ?
    WHERE idf = ? AND user_id = ?
  `;

  db.query(sql, [nom, email, tel, categorie, rating, ida_f, image_url, idf, user_id], (err, result) => {
    if (err) {
      console.error("Erreur modification fournisseur:", err);
      return res.status(500).json({ error: "Erreur modification fournisseur" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Fournisseur non trouvé ou pas accessible" });
    }

    res.status(200).json({ message: "Fournisseur modifié avec succès" });
  });
};


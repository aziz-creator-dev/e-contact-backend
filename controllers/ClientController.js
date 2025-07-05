const db = require('../config/db'); // ✔️ تأكد من المسار
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

// ✅ Ajouter un client
exports.addClient = (req, res) => {
  const { nom, email, tel, pays, ville, adresse ,user_id } = req.body;

  const adresseSql = `
    INSERT INTO adress (pays, ville ,adresse)
    VALUES (?, ?, ?)
  `;

  db.query(adresseSql, [pays, ville ,adresse], (err, adresseResult) => {
    if (err) {
      console.error("Erreur insertion adresse:", err);
      return res.status(500).json({ error: "Erreur insertion adresse" });
    }

    const ida_c = adresseResult.insertId;

    const clientSql = `
      INSERT INTO client (nom, email, tel, ida_c, user_id)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(clientSql, [nom, email, tel, ida_c, user_id], (err, clientResult) => {
      if (err) {
        console.error("Erreur insertion client:", err);
        return res.status(500).json({ error: "Erreur insertion client" });
      }

      res.status(201).json({
        message: "Client et adresse ajoutés avec succès",
        id_client: clientResult.insertId,
        id_adresse: ida_c
      });
    });
  });
};



// ✅ Obtenir les clients par user_id
exports.getClients = (req, res) => {
  const user_id = req.query.user_id;

  if (!user_id) {
    return res.status(400).json({ error: "user_id manquant" });
  }

  const sql = `SELECT * FROM client WHERE user_id = ?`;

  db.query(sql, [user_id], (err, result) => {
    if (err) {
      console.error("Erreur récupération clients:", err);
      return res.status(500).json({ error: "Erreur récupération clients" });
    }
    res.status(200).json(result);
  });
}; 

// ✅ Supprimer un client
exports.deleteClient = (req, res) => {
  const { idc } = req.params;
  const user_id = req.query.user_id;

  if (!user_id) return res.status(400).json({ error: "user_id manquant" });

  const sql = `DELETE FROM client WHERE idc = ? AND user_id = ?`;

  db.query(sql, [idc, user_id], (err, result) => {
    if (err) {
      console.error("Erreur suppression client:", err);
      return res.status(500).json({ error: "Erreur suppression client" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Client non trouvé ou pas accessible" });
    }

    res.status(200).json({ message: "Client supprimé avec succès" });
  });
};

// ✅ Mettre à jour un client
exports.updateClient = (req, res) => {
  const { idc } = req.params;
  const { nom, email, tel, ida_c, user_id } = req.body;

  if (!user_id) return res.status(400).json({ error: "user_id manquant" });

  const sql = `
    UPDATE client
    SET nom = ?, email = ?, tel = ?, ida_c = ?
    WHERE idc = ? AND user_id = ?
  `;

  db.query(sql, [nom, email, tel, ida_c, idc, user_id], (err, result) => {
    if (err) {
      console.error("Erreur modification client:", err);
      return res.status(500).json({ error: "Erreur modification client" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Client non trouvé ou pas accessible" });
    }

    res.status(200).json({ message: "Client modifié avec succès" });
  });
};



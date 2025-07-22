const db = require('../config/db'); 

const createPersonnel = (req, res) => {
  const { nom, email, tel } = req.body;

  if (!nom || !email || !tel) {
    return res.status(400).json({ message: "Champs requis manquants" });
  }

  const sql = "INSERT INTO personnels (nom, email, tel) VALUES (?, ?, ?)";
  db.query(sql, [nom, email, tel], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: "Contact ajouté avec succès", idp: result.insertId });
  });
};


const getAllPersonnels = (req, res) => {
  const sql = "SELECT * FROM personnels";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json(result);
  });
};


const updatePersonnel = (req, res) => {
  const idp = req.params.idp;
  const { nom, email, tel } = req.body;

  const sql = "UPDATE personnels SET nom=?, email=?, tel=? WHERE idp=?";
  db.query(sql, [nom, email, tel, idp], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json({ message: "Contact modifié avec succès" });
  });
};

const deletePersonnel = (req, res) => {
  const idp = req.params.idp;
  const sql = "DELETE FROM personnels WHERE idp=?";
  db.query(sql, [idp], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json({ message: "Contact supprimé avec succès" });
  });
};

module.exports = {
  createPersonnel,
  getAllPersonnels,
  updatePersonnel,
  deletePersonnel,
};

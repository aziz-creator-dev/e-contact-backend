const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');
const controller = require('../controllers/FournisseurController');

// Controller CRUD
router.post('/', controller.addFournisseur);
router.get('/', controller.getFournisseurs);
router.delete('/:idf', controller.deleteFournisseur);
router.put('/:idf', controller.updateFournisseur);

// Recherche dynamique fournisseurs (POST /search)
router.post('/search', (req, res) => {
  const { secteur, produit } = req.body;
  if (!secteur || !produit) {
    return res.status(400).json({ error: "Paramètres manquants: secteur et produit requis." });
  }
  const pythonScriptPath = path.join(__dirname, '..', 'scraping','fournisseur', 'scraping_fournisseurs.py');
  const python = spawn('python', [pythonScriptPath, secteur, produit]);
  let result = '', errorOutput = '';
  python.stdout.on('data', (data) => { result += data.toString(); });
  python.stderr.on('data', (data) => { errorOutput += data.toString(); console.error(`Python stderr: ${data}`); });
  python.on('close', (code) => {
    if (code === 0) {
      try {
        const parsed = result.trim() ? JSON.parse(result.trim()) : [];
        res.json(parsed);
      } catch (e) {
        res.status(500).json({ error: "Erreur parsing JSON", raw: result });
      }
    } else {
      res.status(500).json({ error: "Erreur d'exécution du script Python", stderr: errorOutput });
    }
  });
});

// *** Nouveau : Route GET /secteurs pour récupérer secteurs dynamiquement
router.get('/secteurs', (req, res) => {
  const pythonScriptPath = path.join(__dirname, '..', 'scraping','fournisseur', 'get_secteur.py');
  const python = spawn('python', [pythonScriptPath]);
  let result = '', errorOutput = '';
  python.stdout.on('data', (data) => { result += data.toString(); });
  python.stderr.on('data', (data) => { errorOutput += data.toString(); console.error(`Python stderr: ${data}`); });
  python.on('close', (code) => {
    if (code === 0) {
      try {
        const parsed = result.trim() ? JSON.parse(result.trim()) : [];
        res.json(parsed);
      } catch (e) {
        res.status(500).json({ error: "Erreur parsing JSON", raw: result });
      }
    } else {
      res.status(500).json({ error: "Erreur d'exécution du script Python", stderr: errorOutput });
    }
  });
});

// *** Nouveau : Route GET /produits?secteur=XX
router.get('/produits', (req, res) => {
  const secteur = req.query.secteur;
  if (!secteur) {
    return res.status(400).json({ error: "Paramètre 'secteur' manquant" });
  }

  const pythonScriptPath = path.join(__dirname, '..', 'scraping','fournisseur', 'get_produits_by_secteur.py');
  const python = spawn('python', [pythonScriptPath, secteur]);

  let result = '', errorOutput = '';
  python.stdout.on('data', (data) => { result += data.toString(); });
  python.stderr.on('data', (data) => { errorOutput += data.toString(); console.error(`Python stderr: ${data}`); });

  python.on('close', (code) => {
    if (code === 0) {
      try {
        const parsed = result.trim() ? JSON.parse(result.trim()) : [];
        
        res.json(parsed);
      } catch (e) {
        res.status(500).json({ error: "Erreur parsing JSON", raw: result });
      }
    } else {
      res.status(500).json({ error: "Erreur d'exécution du script Python", stderr: errorOutput });
    }
  });
});

module.exports = router;

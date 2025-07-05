const express = require('express');
const router = express.Router();
const controller = require('../controllers/ClientController');
const path = require('path');
const { spawn } = require('child_process');


router.post('/', controller.addClient);
router.get('/', controller.getClients);
router.delete('/:idc', controller.deleteClient);
router.put('/:idc', controller.updateClient);


router.post('/search', (req, res) => {
  const { secteur, denomination } = req.body;
  if (!secteur || !denomination) {
    return res.status(400).json({ error: "Paramètres manquants: secteur et denomination requis." });
  }

  const pythonScriptPath = path.join(__dirname, '..', 'scraping','client', 'scraping_clients.py');
  const python = spawn('python', [pythonScriptPath, secteur, denomination]);

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

router.get('/secteurs', (req, res) => {
  const pythonScriptPath = path.join(__dirname, '..', 'scraping', 'client','get_client_secteurs.py');
  const python = spawn('python', [pythonScriptPath]);

  let result = '', errorOutput = '';
  python.stdout.on('data', (data) => { result += data.toString(); });
  python.stderr.on('data', (data) => { errorOutput += data.toString(); });

  python.on('close', (code) => {
    if (code === 0) {
      try {
        const parsed = result.trim() ? JSON.parse(result.trim()) : [];
        res.json(parsed);
      } catch (e) {
        res.status(500).json({ error: "Erreur parsing JSON", raw: result });
      }
    } else {
      res.status(500).json({ error: "Erreur d'exécution script Python", stderr: errorOutput });
    }
  });
});


module.exports = router;


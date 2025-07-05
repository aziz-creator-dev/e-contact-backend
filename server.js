const express = require('express');
const app = express();

app.get('/test', (req, res) => {
  res.json([
    { id: 1, nom: 'Fournisseur1' },
    { id: 2, nom: 'Fournisseur2' }
  ]);
});

app.listen(3003, () => {
  console.log('✅ Serveur lancé sur le port 3000');
});

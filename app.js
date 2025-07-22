const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

const FRoutes = require('./routes/FournisseurRoutes'); 
const CRoutes = require('./routes/ClientRoutes'); 
const authRoutes = require('./routes/authRoutes');

app.use(express.json()); 

app.use('/api/auth', authRoutes);

app.use('/api/clients', CRoutes);

app.use('/api/fournisseurs', FRoutes);

app.use('/api/personnels', require('./routes/persoRoutes')); 


app.listen(3005, () => {
  console.log("Server running on port 3005");
});



const express = require('express');
const app = express();
const adminRoutes = require('./routes/adminRoutes');
const clientRoutes = require('./routes/clientRoutes');

// Middleware pour le traitement des données JSON
app.use(express.json());

// Utilisation des routes pour le côté admin
app.use('/admin', adminRoutes);

// Utilisation des routes pour le côté client
app.use('/client', clientRoutes);

// Port du serveur
const port = 3000;

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
    
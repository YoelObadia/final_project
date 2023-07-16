const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const mysql = require('mysql2');

// Middleware pour le traitement des données JSON
app.use(express.json());
app.use(cors());

const con = mysql.createConnection(
    {
        host: 'localhost',
        user:'root',
        port: 3306,
        password:'Yoyo5555badia()',
        database:'fs7'
    }
);

// Endpoint pour la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './UserSelection.js'));
});

// Endpoint pour la page de connexion admin
app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, './admin/AdminLogin.js'));
});

// Endpoint pour la page de connexion client
app.get('/client/login', (req, res) => {
  res.sendFile(path.join(__dirname, './client/ClientLogin.js'));
});

// Endpoint pour la page d'accueil admin
app.get('/admin/home', (req, res) => {
  res.sendFile(path.join(__dirname, './admin/AdminHome.js'));
});

// Endpoint pour la page d'accueil client
app.get('/client/home', (req, res) => {
  res.sendFile(path.join(__dirname, './client/ClientHome.js'));
});

// Endpoint pour la page d'inscription client
app.get('/client/register', (req, res) => {
  res.sendFile(path.join(__dirname, './client/ClientRegister.js'));
});

// Démarrage du serveur
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

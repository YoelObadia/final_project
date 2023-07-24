const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Créer une application Express
const app = express();

// Configuration du middleware CORS
app.use(cors());

// Configuration du middleware pour la gestion des données au format JSON
app.use(express.json());

// Configuration de la connexion à la base de données MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: 'computer',
  database: 'fs7',
});

// Vérifier la connexion à la base de données
connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
    return;
  }
  console.log('Connecté à la base de données MySQL');
});

app.get('/admin/login', (req, res) => {
  try {
    // Code pour récupérer les informations nécessaires pour la page client/login
    // Ici, nous pouvons simplement renvoyer un message indiquant que c'est la page client/login
    res.json({ message: 'Admin login page' });
  } catch (error) {
    console.error('Erreur lors de l\'accès à la page admin/login :', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de l\'accès à la page admin/login.' });
  }
});


//////////////////////////////////////////////////client login


// Exemple de route POST pour la connexion du client
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;

  // Effectuer la logique de connexion du client en vérifiant les informations dans la base de données
  const sql = `
    SELECT a.id, a.firstname, a.lastname, ap.password
    FROM admin a
    INNER JOIN admin_password ap ON a.id = ap.userId
    WHERE ap.username = '${username}'
  `;

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la requête de connexion de l\'admin :', err);
      res.status(500).json({ message: 'Une erreur est survenue lors de la connexion.' });
      return;
    }

    if (results.length === 0) {
      // Aucun utilisateur trouvé avec le nom d'utilisateur spécifié
      res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect.' });
      return;
    }

    const user = results[0];

    if (user.password !== password) {
      // Le mot de passe est incorrect
      res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect.' });
      return;
    }

    // Les informations de connexion sont valides
    res.json({
      id: user.id,
      username,
      firstname: user.firstname,
      lastname: user.lastname,
    });
  });
});

//////////////////////////////////////////////////customer info
  app.get('/api/clients', (req, res) => {
    const sql = 'SELECT * FROM client';

    connection.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching clients from the database:', err);
        res.status(500).json({ error: 'Failed to fetch clients from the database.' });
        return;
      }

      res.json(results);
    });
  });




  ////////////////////////////////////////////////transactions


  app.get('/admin/transactions/:userId', (req, res) => {
    const { userId } = req.params;
    const { filter } = req.query;
    let sql;
    let params = [userId, userId, userId, userId];
  
    switch (filter) {
      case 'deposit':
        sql = `
          SELECT 'Deposit' AS transactionType, amount, timestamp, null AS reason, null AS receiverAccountNumber
          FROM deposits
          WHERE userId = ?
          ORDER BY timestamp DESC
        `;
        break;
      case 'withdraw':
        sql = `
          SELECT 'Withdraw' AS transactionType, amount, timestamp, null AS reason, null AS receiverAccountNumber
          FROM withdraws
          WHERE userId = ?
          ORDER BY timestamp DESC
        `;
        break;
      case 'received':
        sql = `
          SELECT 'Received Transfer' AS transactionType, amount, timestamp, reason, senderAccountNumber AS receiverAccountNumber
          FROM received_transfers
          WHERE userId = ?
          ORDER BY timestamp DESC
        `;
        break;
      case 'shared':
        sql = `
          SELECT 'Shared Transfer' AS transactionType, amount, timestamp, reason, receiverAccountNumber
          FROM shared_transfers
          WHERE userId = ?
          ORDER BY timestamp DESC
        `;
        break;
      default:
        sql = `
          SELECT 'Deposit' AS transactionType, amount, timestamp, null AS reason, null AS receiverAccountNumber
          FROM deposits
          WHERE userId = ?
          UNION ALL
          SELECT 'Withdraw' AS transactionType, amount, timestamp, null AS reason, null AS receiverAccountNumber
          FROM withdraws
          WHERE userId = ?
          UNION ALL
          SELECT 'Received Transfer' AS transactionType, amount, timestamp, reason, senderAccountNumber AS receiverAccountNumber
          FROM received_transfers
          WHERE userId = ?
          UNION ALL
          SELECT 'Shared Transfer' AS transactionType, amount, timestamp, reason, receiverAccountNumber
          FROM shared_transfers
          WHERE userId = ?
          ORDER BY timestamp DESC
        `;
    }
  
    connection.query(sql, params, (err, result) => {
      if (err) {
        console.error('Error fetching transactions:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json(result);
      }
    });
  });
  


// Démarre le serveur sur le port 3000
app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});




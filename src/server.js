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
  password: 'Yoyo5555badia()',
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

// Définir les routes de l'API

// Exemple de route GET
app.get('/admin/login', (req, res) => {
  // Code pour la gestion de la connexion admin
  res.json({ message: 'Admin login' });
});

// Exemple de route GET
app.get('/client/login', (req, res) => {
  // Code pour la gestion de la connexion client
  res.json({ message: 'Client login' });
});

// Démarre le serveur sur le port 3000
app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});




//////////////////////////////////////////////////client login


// Exemple de route POST pour la connexion du client
app.post('/client/login', (req, res) => {
  const { username, password } = req.body;

  // Effectuer la logique de connexion du client en vérifiant les informations dans la base de données
  const sql = `
    SELECT c.id, c.firstname, c.lastname, cp.password
    FROM client c
    INNER JOIN client_password cp ON c.id = cp.userId
    WHERE c.username = '${username}'
  `;

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la requête de connexion du client :', err);
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








//////////////////////////////////////////client home

// Exemple de route GET pour la page d'accueil du client
app.get('/client/home', (req, res) => {
  const { userId } = req.query;

  // Effectuer la logique pour récupérer les informations du client à afficher sur la page d'accueil
  const sql = `
    SELECT firstname, lastname
    FROM client
    WHERE id = ${userId}
  `;

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des informations du client :', err);
      res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des informations du client.' });
      return;
    }

    if (results.length === 0) {
      // Aucun utilisateur trouvé avec l'ID spécifié
      res.status(404).json({ message: 'Utilisateur non trouvé.' });
      return;
    }

    const user = results[0];

    // Les informations du client sont valides
    res.json({
      firstname: user.firstname,
      lastname: user.lastname,
    });
  });
});


///////////////////////transfer deposit

// Exemple de route GET pour la page de dépôt du client
// Exemple de route GET pour la page de dépôt du client
app.get('/client/deposit', (req, res) => {
  // Effectuer la logique pour récupérer les informations nécessaires pour la page de dépôt
  // Ici, nous pouvons simplement renvoyer un message indiquant que c'est la page de dépôt du client
  res.json({ message: 'Client deposit page' });
});


// Exemple de route PUT pour le dépôt du client
app.put('/client/deposit', (req, res) => {
  const { userId, amount } = req.body;

  // Vérifier que l'utilisateur existe dans la base de données avant de procéder au dépôt
  const checkUserQuery = `SELECT id FROM client WHERE id = ${userId}`;

  connection.query(checkUserQuery, (err, result) => {
    if (err) {
      console.error('Erreur lors de la vérification de l\'utilisateur :', err);
      res.status(500).json({ message: 'Une erreur est survenue lors du dépôt.' });
      return;
    }
 
    if (result.length === 0) {
      res.status(404).json({ message: 'Utilisateur non trouvé.' });
      return;
    }

    // L'utilisateur existe dans la base de données, procéder au dépôt
    const depositQuery = `UPDATE client_account SET balance = balance + ${amount} WHERE userId = ${userId}`;

    connection.query(depositQuery, (err, result) => {
      if (err) {
        console.error('Erreur lors du dépôt :', err);
        res.status(500).json({ message: 'Une erreur est survenue lors du dépôt.' });
        return;
      }

      res.json({ message: 'Dépôt effectué avec succès!' });
    });
  });
});


/////////////////////////transfer withdraw

// Exemple de route GET pour la page de dépôt du client
app.get('/client/withdrawal', (req, res) => {
  // Effectuer la logique pour récupérer les informations nécessaires pour la page de dépôt
  // Ici, nous pouvons simplement renvoyer un message indiquant que c'est la page de dépôt du client
  res.json({ message: 'Client deposit page' });
});


app.put('/client/withdrawal', (req, res) => {
  const { userId, amount } = req.body;

  // Vérifier que l'utilisateur existe dans la base de données avant de procéder au dépôt
  const checkUserQuery = `SELECT id FROM client WHERE id = ${userId}`;

  connection.query(checkUserQuery, (err, result) => {
    if (err) {
      console.error('Erreur lors de la vérification de l\'utilisateur :', err);
      res.status(500).json({ message: 'Une erreur est survenue lors du retrait.' });
      return;
    }
 
    if (result.length === 0) {
      res.status(404).json({ message: 'Utilisateur non trouvé.' });
      return;
    }

    // L'utilisateur existe dans la base de données, procéder au dépôt
    const depositQuery = `UPDATE client_account SET balance = balance - ${amount} WHERE userId = ${userId}`;

    connection.query(depositQuery, (err, result) => {
      if (err) {
        console.error('Erreur lors du retrait :', err);
        res.status(500).json({ message: 'Une erreur est survenue lors du retrait.' });
        return;
      }

      res.json({ message: 'Retrait effectué avec succès!' });
    });
  });
});


/////////////////////////transfer 

app.get('/client/transfer', (req, res) => {
  // Effectuer la logique pour récupérer les informations nécessaires pour la page de dépôt
  // Ici, nous pouvons simplement renvoyer un message indiquant que c'est la page de dépôt du client
  res.json({ message: 'Client transfer page' });
});

// Exemple de route PUT pour le transfert du client
app.put('/client/transfer', (req, res) => {
  const { userId, transferAmount, paymentReason, recipientAccountNumber } = req.body;

  // Vérifier que l'utilisateur existe dans la base de données avant de procéder au transfert
  const checkUserQuery = `SELECT id, balance FROM client_account WHERE userId = ${userId}`;

  connection.query(checkUserQuery, (err, userResult) => {
    if (err) {
      console.error('Erreur lors de la vérification de l\'utilisateur :', err);
      res.status(500).json({ message: 'Une erreur est survenue lors du transfert.' });
      return;
    }

    if (userResult.length === 0) {
      res.status(404).json({ message: 'Utilisateur non trouvé.' });
      return;
    }

    const user = userResult[0];

    
    // Vérifier que l'utilisateur a un solde suffisant pour effectuer le transfert
if (parseFloat(user.balance) < parseFloat(transferAmount)) {
  res.status(400).json({ message: 'Solde insuffisant.' });
  return;
}

    // Vérifier que le destinataire existe dans la base de données
    const checkRecipientQuery = `SELECT id FROM client_account WHERE accountNumber = '${recipientAccountNumber}'`;

    connection.query(checkRecipientQuery, (err, recipientResult) => {
      if (err) {
        console.error('Erreur lors de la vérification du destinataire :', err);
        res.status(500).json({ message: 'Une erreur est survenue lors du transfert.' });
        return;
      }

      if (recipientResult.length === 0) {
        res.status(404).json({ message: 'Destinataire non trouvé.' });
        return;
      }

      // Effectuer le transfert
      const recipient = recipientResult[0];
      const updateSenderBalanceQuery = `UPDATE client_account SET balance = balance - ${transferAmount} WHERE userId = ${userId}`;
      const updateRecipientBalanceQuery = `UPDATE client_account SET balance = balance + ${transferAmount} WHERE id = ${recipient.id}`;

      connection.beginTransaction((err) => {
        if (err) {
          console.error('Erreur lors du démarrage de la transaction :', err);
          res.status(500).json({ message: 'Une erreur est survenue lors du transfert.' });
          return;
        }

        connection.query(updateSenderBalanceQuery, (err, senderResult) => {
          if (err || senderResult.affectedRows === 0) {
            connection.rollback(() => {
              console.error('Erreur lors de la mise à jour du solde de l\'expéditeur :', err);
              res.status(500).json({ message: 'Une erreur est survenue lors du transfert.' });
            });
            return;
          }

          connection.query(updateRecipientBalanceQuery, (err, recipientResult) => {
            if (err || recipientResult.affectedRows === 0) {
              connection.rollback(() => {
                console.error('Erreur lors de la mise à jour du solde du destinataire :', err);
                res.status(500).json({ message: 'Une erreur est survenue lors du transfert.' });
              });
              return;
            }

            // Commit la transaction si tout s'est bien passé
            connection.commit((err) => {
              if (err) {
                connection.rollback(() => {
                  console.error('Erreur lors de la confirmation de la transaction :', err);
                  res.status(500).json({ message: 'Une erreur est survenue lors du transfert.' });
                });
                return;
              }

              // Transfert réussi
              res.json({ message: 'Transfert effectué avec succès!' });
            });
          });
        });
      });
    });
  });
});

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'remote_user',
  port: 3306,
  password: 'reverso',
  database: 'fs7',
});

connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
    return;
  }
  console.log('Connecté à la base de données MySQL');
});

// Partie Server Admin

app.get('/admin/login', (req, res) => {
  try {
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
  


///////////////////////////// add admin
// ...

app.post('/admin/addadmin', (req, res) => {
    const newAdmin = req.body;
  
    const insertAdminQuery = 'INSERT INTO admin (firstname, lastname, phone, email, address, username) VALUES (?, ?, ?, ?, ?, ?)';
  
    connection.query(
      insertAdminQuery,
      [newAdmin.firstname, newAdmin.lastname, newAdmin.phone, newAdmin.email, newAdmin.address, newAdmin.username],
      (err, result) => {
        if (err) {
          console.error('Erreur lors de l\'exécution de la requête pour insérer le nouvel administrateur', err);
          res.status(500).send({ error: 'Une erreur est survenue lors de l\'ajout du nouvel administrateur' });
          return;
        }
  
        console.log('Nouvel administrateur ajouté avec succès !');
        res.status(200).send({ insertId: result.insertId });
      }
    );
  });
  
  // Route pour ajouter le nom d'utilisateur et le mot de passe dans la table 'admin_password'
  app.post('/admin/addadmin/password', (req, res) => {
    const newAdminPassword = req.body;
  
    const insertAdminPasswordQuery = 'INSERT INTO admin_password (userId, username, password) VALUES (?, ?, ?)';
  
    connection.query(insertAdminPasswordQuery, [newAdminPassword.userId, newAdminPassword.username, newAdminPassword.password], (err) => {
      if (err) {
        console.error('Erreur lors de l\'exécution de la requête pour insérer le nom d\'utilisateur et le mot de passe de l\'administrateur', err);
        res.status(500).send({ error: 'Une erreur est survenue lors de l\'ajout du nom d\'utilisateur et du mot de passe de l\'administrateur' });
        return;
      }
  
      console.log('Nom d\'utilisateur et mot de passe administrateur ajoutés avec succès !');
      res.status(200).send({ success: true });
    });
  });
  
  //////////////////////////////////////////////////customer info
    
  
  
    app.get('/admin/customerInfo', (req, res) => {
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
  
    app.get('/admin/transaction', (req, res) => {
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
    

// Partie Server Client

app.get('/client/login', (req, res) => {
  try {
    res.json({ message: 'Client login page' });
  } catch (error) {
    console.error('Erreur lors de l\'accès à la page client/login :', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de l\'accès à la page client/login.' });
  }
});

//////////////////////////////////////////////////client login


// Exemple de route POST pour la connexion du client
app.post('/client/login', (req, res) => {
    const { username, password } = req.body;
  
    // Effectuer la logique de connexion du client en vérifiant les informations dans la base de données
    const sql = `
      SELECT c.id, c.firstname, c.lastname, cp.password, ca.balance
      FROM client c
      INNER JOIN client_password cp ON c.id = cp.userId
      INNER JOIN client_account ca ON c.id = ca.userId
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
        balance: user.balance // Adding the balance to the response
      });
    });
  });
  
  
  //////////////////////////////////////////client home
  
  // Exemple de route GET pour la page d'accueil du client
  app.get('/client/home', (req, res) => {

    try {
        res.json({ message: 'Client ho;e page' });
      } catch (error) {
        console.error('Erreur lors de l\'accès à la page client/home :', error);
        res.status(500).json({ message: 'Une erreur est survenue lors de l\'accès à la page client/home.' });
      }
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
  
        // Récupérer le nouveau solde après le dépôt réussi
        const getNewBalanceQuery = `SELECT balance FROM client_account WHERE userId = ${userId}`;
        connection.query(getNewBalanceQuery, (err, result) => {
          if (err) {
            console.error('Erreur lors de la récupération du nouveau solde :', err);
            res.status(500).json({ message: 'Une erreur est survenue lors du dépôt.' });
            return;
          }
  
          const newBalance = result[0].balance;
  
          res.json({ message: 'Dépôt effectué avec succès!', newBalance });
        });
      });
    });
  });
  
  
  app.post('/client/deposit', (req, res) => {
    const { userId, amount } = req.body;
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format de timestamp compatible avec MySQL DATETIME
  
    
      // L'utilisateur existe dans la base de données, procéder à l'insertion du retrait dans la table "withdraws"
      const insertDepositQuery = `INSERT INTO deposits (userId, amount, timestamp) VALUES (${userId}, ${amount}, '${timestamp}')`;
  
      connection.query(insertDepositQuery, (err) => {
        if (err) {
          console.error('Erreur lors de l\'insertion du retrait :', err);
          res.status(500).json({ message: 'Une erreur est survenue lors du retrait.' });
          return;
        }
  
        // Le retrait a été inséré avec succès, renvoyer une réponse avec un message de succès
        res.json({ message: 'Depot effectué avec succès!' });
      
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
  
    // Vérifier que l'utilisateur existe dans la base de données avant de procéder au retrait
    const checkUserQuery = `SELECT id, balance FROM client_account WHERE userId = ${userId}`;
  
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
  
      const user = result[0];
      const currentBalance = parseFloat(user.balance);
  
      // Vérifier que le solde est suffisant pour effectuer le retrait
      if (amount > currentBalance) {
        res.status(400).json({ message: 'Solde insuffisant pour effectuer le retrait.' });
        return;
      }
  
      // L'utilisateur existe dans la base de données et le solde est suffisant, procéder au retrait
      const updatedBalance = currentBalance - amount;
  
      // Mettre à jour le solde dans la base de données
      const updateBalanceQuery = `UPDATE client_account SET balance = ${updatedBalance} WHERE userId = ${userId}`;
  
      connection.query(updateBalanceQuery, (err) => {
        if (err) {
          console.error('Erreur lors de la mise à jour du solde :', err);
          res.status(500).json({ message: 'Une erreur est survenue lors du retrait.' });
          return;
        }
  
        // Le solde a été mis à jour avec succès, renvoyer une réponse avec un message de succès et le nouveau solde
        res.json({ message: 'Retrait effectué avec succès!', newBalance: updatedBalance });
      });
    });
  });
  
  
  
  app.post('/client/withdrawal', (req, res) => {
    const { userId, amount } = req.body;
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format de timestamp compatible avec MySQL DATETIME
  
    
      // L'utilisateur existe dans la base de données, procéder à l'insertion du retrait dans la table "withdraws"
      const insertWithdrawQuery = `INSERT INTO withdraws (userId, amount, timestamp) VALUES (${userId}, ${amount}, '${timestamp}')`;
  
      connection.query(insertWithdrawQuery, (err) => {
        if (err) {
          console.error('Erreur lors de l\'insertion du retrait :', err);
          res.status(500).json({ message: 'Une erreur est survenue lors du retrait.' });
          return;
        }
  
        // Le retrait a été inséré avec succès, renvoyer une réponse avec un message de succès
        res.json({ message: 'Retrait effectué avec succès!' });
      
    });
  });

  ///////////////////////////////// client transfer 

// Route GET pour la page de transfert du client
app.get('/client/transfer', (req, res) => {
    // Effectuer la logique pour récupérer les informations nécessaires pour la page de transfert
    // Ici, nous pouvons simplement renvoyer un message indiquant que c'est la page de transfert du client
    res.json({ message: 'Client transfer page' });
  });
  
  // Route PUT pour le transfert du client
  app.put('/client/transfer', (req, res) => {
    const { userId, transferAmount, recipientAccountNumber } = req.body;
  
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
  
                // Transfert réussi, retourner le nouveau solde de l'expéditeur
                res.json({ message: 'Transfert effectué avec succès!', newBalance: user.balance - parseFloat(transferAmount) });
              });
            });
          });
        });
      });
    });
  });
  
  
  app.post('/client/transfershared', async (req, res) => {
    const { userId, amount, reason, receiverAccountNumber } = req.body;
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
    // Récupérer le senderAccountNumber depuis la base de données en utilisant le userId
    const selectSenderAccountNumberQuery = `SELECT accountNumber FROM client_account WHERE userId = '${userId}'`;
  
    // Récupérer le userIdReceiver depuis la base de données en utilisant le receiverAccountNumber
    const selectUserIdReceiverQuery = `SELECT userId FROM client_account WHERE accountNumber = '${receiverAccountNumber}'`;
  
    // Exécuter les requêtes pour récupérer les valeurs
    let senderAccountNumber, userIdReceiver;
    try {
      const [senderAccountNumberRows] = await connection.promise().query(selectSenderAccountNumberQuery);
      const [userIdReceiverRows] = await connection.promise().query(selectUserIdReceiverQuery);
  
      // Vérifier si les résultats des requêtes sont valides
      if (!senderAccountNumberRows.length || !userIdReceiverRows.length) {
        throw new Error("Les informations du compte ne sont pas valides.");
      }
  
      senderAccountNumber = senderAccountNumberRows[0].accountNumber;
      userIdReceiver = userIdReceiverRows[0].userId;
    } catch (error) {
      console.error('Erreur lors de la récupération des informations du compte :', error);
      res.status(500).json({ message: 'Une erreur est survenue lors du transfert.' });
      return;
    }
  
    // Insérer dans la table "shared_transfers"
    const insertSharedTransfersQuery = `INSERT INTO shared_transfers (userId, amount, reason, receiverAccountNumber, timestamp) VALUES (${userId}, ${amount}, '${reason}', '${receiverAccountNumber}', '${timestamp}')`;
  
    // Insérer dans la table "received_transfers" pour le destinataire
    const insertReceivedTransfersQuery = `INSERT INTO received_transfers (userId, amount, reason, senderAccountNumber, timestamp) VALUES (${userIdReceiver}, ${amount}, '${reason}', '${senderAccountNumber}', '${timestamp}')`;
  
    // Exécuter les deux requêtes d'insertion dans le cadre d'une transaction
    connection.beginTransaction(async (err) => {
      if (err) {
        console.error('Erreur lors du début de la transaction :', err);
        res.status(500).json({ message: 'Une erreur est survenue lors du transfert.' });
        return;
      }
  
      try {
        await connection.promise().query(insertSharedTransfersQuery);
        await connection.promise().query(insertReceivedTransfersQuery);
  
        // Valider la transaction
        connection.commit((err) => {
          if (err) {
            console.error('Erreur lors de la confirmation de la transaction :', err);
            connection.rollback(() => {
              res.status(500).json({ message: 'Une erreur est survenue lors du transfert.' });
            });
            return;
          }
  
          // Transaction validée avec succès, envoyer une réponse de succès
          res.json({ message: 'Transfert effectué avec succès!' });
        });
      } catch (error) {
        console.error('Erreur lors de l\'insertion du transfert :', error);
        connection.rollback(() => {
          res.status(500).json({ message: 'Une erreur est survenue lors du transfert.' });
        });
      }
    });
  });
  
  
  
  
  /////////////////////// client register
  
  // Exemple de route GET pour accéder à la page client/register depuis client/login
  app.get('/client/register', (req, res) => {
    try {
      // Code pour récupérer les informations nécessaires pour la page client/register
      // Ici, nous pouvons simplement renvoyer un message indiquant que c'est la page client/register
      res.json({ message: 'Client register page' });
    } catch (error) {
      console.error('Erreur lors de l\'accès à la page client/register :', error);
      res.status(500).json({ message: 'Une erreur est survenue lors de l\'accès à la page client/register.' });
    }
  });
  
  // Exemple de route POST pour l'enregistrement du client
  // It expects the request body to contain data for creating a new user.
  app.post('/client/register', (req, res) => {
  
    const newUser = req.body; // Extract the new user data from the request body
    
    // Define the SQL query to insert the new user into the 'users' table
    const query = 'INSERT INTO client SET ?';
  
    const username=newUser.username; // Extract the username from the new user data
  
    // Define the SQL query to retrieve the newly added user
    const query1 = 'SELECT * FROM client WHERE username = ?';
  
    // Execute the first query to insert the new user into the database
    connection.query(query, [newUser], (err, results) => {
      if (err) {
        // If an error occurs during the query execution, log the error and send a response with an error message
        console.error('Error in request execution', err);
        res.status(500); // Set the response status to 500 (Internal Server Error)
        return res.send({ error: 'An error occurred adding new user' });
      }
  
      // Execute the second query to retrieve the newly added user from the database
      connection.query(query1, username, (err, results1) => {
        if (err) {
              // If an error occurs during the query execution, log the error and send a response with an error message
          console.error('Error in request execution', err);
          res.status(500); // Set the response status to 500 (Internal Server Error)
          return res.send({ error: 'An error occurred getting user' });
        }
  
        const user=results1;
        res.status(200); //Set the response status to 200 (OK)
        res.send(user);});  // Retrieve the user details from the query results
    });
  });

app.post('/client/register/password', (req, res) => {

    const new_user_pass=req.body; // Extract the data from the request body
  
    // Define the SQL query to insert the new user password into the 
    const query = 'INSERT INTO client_password SET ?';
  
    // Execute the SQL query with the new user password as a parameter
    connection.query(query, [new_user_pass], (err, results) => {
      if (err) {
        // If an error occurs during the query execution, log the error and send a response with an error message
        console.error('Error in request execution', err);
        res.status(500); // Set the response status to 500 (Internal Server Error)
        return res.send({ error: 'An error occurred while retrieving user details.' });
      }
   
      // If the query is successful, send a response with the new user password data
       res.status(200); //Set the response status to 200 (OK)
       res.send(new_user_pass);
    });
  });
  
  app.post('/client/register/account', async (req, res) => {
    const { userId, username } = req.body;
  
    const accountNumber = await generateUniqueAccountNumber();
  
    const newAccount = {
      userId: userId,
      username: username,
      accountNumber: accountNumber,
      balance: 0
    };
  
    const query = 'INSERT INTO client_account SET ?';
  
    connection.query(query, [newAccount], (err, results) => {
      if (err) {
        console.error('Error in request execution', err);
        res.status(500);
        return res.send({ error: 'An error occurred while inserting new account' });
      }
  
      res.status(200).send(newAccount);
    });
  });
  
  async function generateUniqueAccountNumber() {
    const existingAccountNumbers = await getExistingAccountNumbers();
  
    let accountNumber;
    do {
      accountNumber = generateRandomAccountNumber();
    } while (existingAccountNumbers.includes(accountNumber));
  
    return accountNumber;
  }
  
  function generateRandomAccountNumber() {
    return Math.floor(100000 + Math.random() * 900000);
  }
  
  function getExistingAccountNumbers() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT accountNumber FROM client_account';
  
      connection.query(query, (err, results) => {
        if (err) {
          console.error('Error in request execution', err);
          reject(err);
        }
  
        const accountNumbers = results.map(result => result.accountNumber);
        resolve(accountNumbers);
      });
    });
  }
  
  
  
  
  /////////////////////////////client transactions
  
  // Endpoint to fetch transactions for a specific userId
  app.get('/client/transactions/:userId', (req, res) => {
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

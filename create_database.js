const mysql = require('mysql2');
const faker = require('faker');

const connection = mysql.createConnection({
  host: '',
  user: '',
  port: '',
  password: '',
  database: '',
});

const query = (sql, values = []) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

// Fonction pour créer des clients
const createClientTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS client (
      id INT AUTO_INCREMENT PRIMARY KEY,
      firstname VARCHAR(100),
      lastname VARCHAR(100),
      phone VARCHAR(20),
      email VARCHAR(100),
      address VARCHAR(255),
      username VARCHAR(100)
    );
  `;
  await query(createTableQuery);
  console.log('Table client créée avec succès');

  // Insérer des données dans la table clients
  for (let i = 0; i < 10; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const phone = '05' + faker.datatype.number({ min: 1000000000, max: 9999999999 });
    const email = faker.internet.email(firstName, lastName);
    const address = faker.address.streetAddress();
    const randomNumber = faker.datatype.number();
    const username = `${firstName}${randomNumber}`;

    const queryStr = 'INSERT INTO client (firstname, lastname, phone, email, address, username) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [firstName, lastName, phone, email, address, username];

    await query(queryStr, values);
    console.log('Client inséré avec succès');
  }
};

// Fonction pour créer la table des mots de passe des clients
const createClientPasswordTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS client_password (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT,
      username VARCHAR(100),
      password VARCHAR(100),
      FOREIGN KEY (userId) REFERENCES client(id)
    );
  `;
  await query(createTableQuery);
  console.log('Table client_password créée avec succès');

  const clients = await query('SELECT * FROM client');
  for (const client of clients) {
    const password = faker.datatype.number({ min: 100000, max: 999999 }).toString();
    const queryStr = 'INSERT INTO client_password (userId, username, password) VALUES (?, ?, ?)';
    const values = [client.id, client.username, password];

    await query(queryStr, values);
  }
  console.log('Mots de passe clients insérés avec succès');
};

// Fonction pour créer la table des comptes clients
const createClientAccountTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS client_account (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT,
      username VARCHAR(100),
      accountNumber VARCHAR(100),
      balance FLOAT,
      FOREIGN KEY (userId) REFERENCES client(id)
    );
  `;
  await query(createTableQuery);
  console.log('Table client_account créée avec succès');

  const clients = await query('SELECT * FROM client');
  for (const client of clients) {
    const accountNumber = faker.datatype.number({ min: 100000, max: 999999 }).toString();
    const balance = faker.datatype.float({ min: 500, max: 10000 }).toFixed(2);
    const queryStr = 'INSERT INTO client_account (userId, username, accountNumber, balance) VALUES (?, ?, ?, ?)';
    const values = [client.id, client.username, accountNumber, parseFloat(balance)];

    await query(queryStr, values);
  }
  console.log('Comptes clients insérés avec succès');
};

// Fonction pour créer des administrateurs
const createAdminTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS admin (
      id INT AUTO_INCREMENT PRIMARY KEY,
      firstname VARCHAR(100),
      lastname VARCHAR(100),
      phone VARCHAR(20),
      email VARCHAR(100),
      address VARCHAR(255),
      username VARCHAR(100)
    );
  `;
  await query(createTableQuery);
  console.log('Table admin créée avec succès');

  // Insérer des données dans la table admin
  for (let i = 0; i < 3; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const phone = '05' + faker.datatype.number({ min: 1000000000, max: 9999999999 });
    const email = faker.internet.email(firstName, lastName);
    const address = faker.address.streetAddress();
    const randomNumber = faker.datatype.number();
    const username = `${firstName}${randomNumber}`;

    const queryStr = 'INSERT INTO admin (firstname, lastname, phone, email, address, username) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [firstName, lastName, phone, email, address, username];

    await query(queryStr, values);
    console.log('Admin inséré avec succès');
  }
};

// Fonction pour créer la table des mots de passe des administrateurs
const createAdminPasswordTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS admin_password (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT,
      username VARCHAR(100),
      password VARCHAR(100),
      FOREIGN KEY (userId) REFERENCES admin(id)
    );
  `;
  await query(createTableQuery);
  console.log('Table admin_password créée avec succès');

  const admins = await query('SELECT * FROM admin');
  for (const admin of admins) {
    const password = faker.datatype.number({ min: 100000, max: 999999 }).toString();
    const queryStr = 'INSERT INTO admin_password (userId, username, password) VALUES (?, ?, ?)';
    const values = [admin.id, admin.username, password];

    await query(queryStr, values);
  }
  console.log('Mots de passe des administrateurs insérés avec succès');
};

const createDepositsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS deposits (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT,
      amount FLOAT,
      timestamp DATETIME,
      FOREIGN KEY (userId) REFERENCES client(id)
    );
  `;
  await query(createTableQuery);
  console.log('Table deposits créée avec succès');

  const clients = await query('SELECT * FROM client');
  for (const client of clients) {
    for (let i = 0; i < 5; i++) {
      const depositAmount = faker.datatype.float({ min: 100, max: 500 }).toFixed(2);
      const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

      const queryStr = 'INSERT INTO deposits (userId, amount, timestamp) VALUES (?, ?, ?)';
      const values = [client.id, parseFloat(depositAmount), timestamp];

      await query(queryStr, values);
    }
  }
  console.log('Dépôts insérés avec succès');
};

const createWithdrawsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS withdraws (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT,
      amount FLOAT,
      timestamp DATETIME,
      FOREIGN KEY (userId) REFERENCES client(id)
    );
  `;
  await query(createTableQuery);
  console.log('Table withdraws créée avec succès');

  const clients = await query('SELECT * FROM client');
  for (const client of clients) {
    for (let i = 0; i < 5; i++) {
      const withdrawalAmount = faker.datatype.float({ min: 50, max: 200 }).toFixed(2);
      const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

      const queryStr = 'INSERT INTO withdraws (userId, amount, timestamp) VALUES (?, ?, ?)';
      const values = [client.id, parseFloat(withdrawalAmount), timestamp];

      await query(queryStr, values);
    }
  }
  console.log('Retraits insérés avec succès');
};

// Fonction pour créer la table des transferts reçus
const createReceivedTransfersTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS received_transfers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT,
      amount FLOAT,
      reason VARCHAR(255),
      senderAccountNumber VARCHAR(100),
      timestamp DATETIME,
      FOREIGN KEY (userId) REFERENCES client(id)
    );
  `;
  await query(createTableQuery);
  console.log('Table received_transfers créée avec succès');

  const clients = await query('SELECT * FROM client');
  for (const client of clients) {
    for (let i = 0; i < 5; i++) {
      const transferAmount = faker.datatype.float({ min: 100, max: 500 }).toFixed(2);
      const transferReason = faker.lorem.sentence();
      const senderAccountNumber = faker.datatype.number({ min: 100000, max: 999999 }).toString();
      const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

      const queryStr = 'INSERT INTO received_transfers (userId, amount, reason, senderAccountNumber, timestamp) VALUES (?, ?, ?, ?, ?)';
      const values = [client.id, parseFloat(transferAmount), transferReason, senderAccountNumber, timestamp];

      await query(queryStr, values);
    }
  }
  console.log('Transferts reçus insérés avec succès');
};

// Fonction pour créer la table des transferts partagés
const createSharedTransfersTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS shared_transfers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT,
      amount FLOAT,
      reason VARCHAR(255),
      receiverAccountNumber VARCHAR(100),
      timestamp DATETIME,
      FOREIGN KEY (userId) REFERENCES client(id)
    );
  `;
  await query(createTableQuery);
  console.log('Table shared_transfers créée avec succès');

  const clients = await query('SELECT * FROM client');
  for (const client of clients) {
    for (let i = 0; i < 5; i++) {
      const transferAmount = faker.datatype.float({ min: 100, max: 500 }).toFixed(2);
      const transferReason = faker.lorem.sentence();
      const receiverAccountNumber = faker.datatype.number({ min: 100000, max: 999999 }).toString();
      const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

      const queryStr = 'INSERT INTO shared_transfers (userId, amount, reason, receiverAccountNumber, timestamp) VALUES (?, ?, ?, ?, ?)';
      const values = [client.id, parseFloat(transferAmount), transferReason, receiverAccountNumber, timestamp];

      await query(queryStr, values);
    }
  }
  console.log('Transferts partagés insérés avec succès');
};

// Fonction pour initialiser la base de données
const initializeDatabase = async () => {
  try {
    await createClientTable();
    await createClientPasswordTable();
    await createClientAccountTable();
    await createAdminTable(); 
    await createAdminPasswordTable(); 
    await createDepositsTable();
    await createWithdrawsTable();
    await createReceivedTransfersTable();
    await createSharedTransfersTable();
    console.log('Toutes les tables ont été créées et les données insérées.');
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    connection.end(); // Fermer la connexion MySQL après toutes les requêtes
  }
};

// Appel de la fonction pour initialiser la base de données
initializeDatabase();

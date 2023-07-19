const faker = require('faker');
const mysql = require('mysql2');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Yoyo5555badia()',
  port: 3306,
  database: 'fs7'
});

const formatDateForMySQL = (date) => {
  const formattedDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');
  return formattedDate;
};

const createClientTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS client (
      id INT PRIMARY KEY AUTO_INCREMENT,
      firstname VARCHAR(255) NOT NULL,
      lastname VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      email VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      username VARCHAR(255) NOT NULL
    )
  `;

  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log('Table "client" created successfully');
    createClientPasswordTable();
  });
};

const createClientPasswordTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS client_password (
      id INT PRIMARY KEY AUTO_INCREMENT,
      userId INT NOT NULL,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      FOREIGN KEY (userId) REFERENCES client(id)
    )
  `;

  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log('Table "client_password" created successfully');
    createClientAccountTable();
  });
};

const createClientAccountTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS client_account (
      id INT PRIMARY KEY AUTO_INCREMENT,
      userId INT NOT NULL,
      username VARCHAR(255) NOT NULL,
      accountNumber VARCHAR(6) UNIQUE NOT NULL,
      balance DECIMAL(10, 2) NOT NULL,
      FOREIGN KEY (userId) REFERENCES client(id)
    )
  `;

  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log('Table "client_account" created successfully');
    createAdminTable();
  });
};

const createAdminTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS admin (
      id INT PRIMARY KEY AUTO_INCREMENT,
      firstname VARCHAR(255) NOT NULL,
      lastname VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      email VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      username VARCHAR(255) NOT NULL
    )
  `;

  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log('Table "admin" created successfully');
    createAdminPasswordTable();
  });
};

const createAdminPasswordTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS admin_password (
      id INT PRIMARY KEY AUTO_INCREMENT,
      userId INT NOT NULL,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      FOREIGN KEY (userId) REFERENCES admin(id)
    )
  `;

  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log('Table "admin_password" created successfully');
    createDepositsTable(); // Nouvelle fonction pour créer la table "deposits"
  });
};

const createDepositsTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS deposits (
      id INT PRIMARY KEY AUTO_INCREMENT,
      userId INT NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      timestamp DATETIME NOT NULL,
      FOREIGN KEY (userId) REFERENCES client(id)
    )
  `;

  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log('Table "deposits" created successfully');
    createWithdrawsTable(); // Nouvelle fonction pour créer la table "withdraws"
  });
};

const createWithdrawsTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS withdraws (
      id INT PRIMARY KEY AUTO_INCREMENT,
      userId INT NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      timestamp DATETIME NOT NULL,
      FOREIGN KEY (userId) REFERENCES client(id)
    )
  `;

  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log('Table "withdraws" created successfully');
    createReceivedTransfersTable(); // Nouvelle fonction pour créer la table "received_transfers"
  });
};

const createReceivedTransfersTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS received_transfers (
      id INT PRIMARY KEY AUTO_INCREMENT,
      userId INT NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      reason VARCHAR(255) NOT NULL,
      senderAccountNumber VARCHAR(6) NOT NULL,
      timestamp DATETIME NOT NULL,
      FOREIGN KEY (userId) REFERENCES client(id)
    )
  `;

  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log('Table "received_transfers" created successfully');
    createSharedTransfersTable(); // Nouvelle fonction pour créer la table "shared_transfers"
  });
};

const createSharedTransfersTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS shared_transfers (
      id INT PRIMARY KEY AUTO_INCREMENT,
      userId INT NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      reason VARCHAR(255) NOT NULL,
      receiverAccountNumber VARCHAR(6) NOT NULL,
      timestamp DATETIME NOT NULL,
      FOREIGN KEY (userId) REFERENCES client(id)
    )
  `;

  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log('Table "shared_transfers" created successfully');
    insertData(); // Appeler la fonction pour insérer les données fictives après la création des tables
  });
};


const insertData = () => {
  // Insert 10 default clients
  for (let i = 0; i < 10; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName().replace("'", "''");
    const phone = '05' + faker.datatype.number({ min: 1000000000, max: 9999999999 });
    const email = faker.internet.email(firstName, lastName);
    const address = faker.address.streetAddress();
    const randomNumber = faker.datatype.number();
    const username = `${firstName}${randomNumber}`;

    const clientSql = `
      INSERT INTO client (firstname, lastname, phone, email, address, username)
      VALUES ('${firstName}', '${lastName}', '${phone}', '${email}', '${address}', '${username}')
    `;

    const password = faker.datatype.number({ min: 100000, max: 999999 }).toString(); // Mot de passe à 6 chiffres

    const passwordSql = `
      INSERT INTO client_password (userId, username, password)
      SELECT id, '${username}', '${password}' FROM client WHERE username = '${username}'
    `;

    const accountNumber = faker.datatype.number({ min: 100000, max: 999999 }).toString();

    const balance = faker.datatype.float({ min: 500, max: 10000 }).toFixed(2);

    const accountSql = `
      INSERT INTO client_account (userId, username, accountNumber, balance)
      SELECT id, '${username}', '${accountNumber}', ${balance} FROM client WHERE username = '${username}'
    `;

    con.query(clientSql, (err, result) => {
      if (err) throw err;
    });

    con.query(passwordSql, (err, result) => {
      if (err) throw err;
    });

    con.query(accountSql, (err, result) => {
      if (err) throw err;
    });
  }

  // Insert 3 default administrators
  for (let i = 0; i < 3; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName().replace("'", "''");
    const phone = '05' + faker.datatype.number({ min: 1000000000, max: 9999999999 });
    const email = faker.internet.email(firstName, lastName);
    const address = faker.address.streetAddress();
    const randomNumber = faker.datatype.number();
    const username = `${firstName}${randomNumber}`;

    const adminSql = `
      INSERT INTO admin (firstname, lastname, phone, email, address, username)
      VALUES ('${firstName}', '${lastName}', '${phone}', '${email}', '${address}', '${username}')
    `;

    const password = faker.datatype.number({ min: 100000, max: 999999 }).toString(); // Mot de passe à 6 chiffres

    const passwordSql = `
      INSERT INTO admin_password (userId, username, password)
      SELECT id, '${username}', '${password}' FROM admin WHERE username = '${username}'
    `;

    con.query(adminSql, (err, result) => {
      if (err) throw err;
    });

    con.query(passwordSql, (err, result) => {
      if (err) throw err;
    });
  }

  // Insert deposits for all clients
  for (let i = 1; i <= 10; i++) {
    for (let j = 0; j < 5; j++) {
      const depositAmount = faker.datatype.float({ min: 100, max: 500 }).toFixed(2);
      const timestamp = formatDateForMySQL(new Date());

      const depositSql = `
        INSERT INTO deposits (userId, amount, timestamp)
        VALUES (${i}, ${depositAmount}, '${timestamp}')
      `;

      con.query(depositSql, (err, result) => {
        if (err) throw err;
      });
    }
  }


  for (let i = 1; i <= 10; i++) {
    for (let k = 0; k < 5; k++) {
      const withdrawAmount = faker.datatype.float({ min: 50, max: 200 }).toFixed(2);
      const timestamp = formatDateForMySQL(new Date());

      const withdrawSql = `
        INSERT INTO withdraws (userId, amount, timestamp)
        VALUES (${i}, ${withdrawAmount}, '${timestamp}')
      `;

      con.query(withdrawSql, (err, result) => {
        if (err) throw err;
      });
    }
  }

  // Insert received transfers for all clients
  for (let i = 1; i <= 10; i++) {
    for (let l = 0; l < 5; l++) {
      const transferAmount = faker.datatype.float({ min: 100, max: 500 }).toFixed(2);
      const transferReason = faker.lorem.sentence();
      const senderAccountNumber = faker.datatype.number({ min: 100000, max: 999999 }).toString();
      const timestamp = formatDateForMySQL(new Date());

      const receivedTransferSql = `
        INSERT INTO received_transfers (userId, amount, reason, senderAccountNumber, timestamp)
        VALUES (${i}, ${transferAmount}, '${transferReason}', '${senderAccountNumber}', '${timestamp}')
      `;

      con.query(receivedTransferSql, (err, result) => {
        if (err) throw err;
      });
    }
  }

  // Insert shared transfers for all clients
  for (let i = 1; i <= 10; i++) {
    for (let m = 0; m < 5; m++) {
      const transferAmount = faker.datatype.float({ min: 100, max: 500 }).toFixed(2);
      const transferReason = faker.lorem.sentence();
      const receiverAccountNumber = faker.datatype.number({ min: 100000, max: 999999 }).toString();
      const timestamp = formatDateForMySQL(new Date());

      const sharedTransferSql = `
        INSERT INTO shared_transfers (userId, amount, reason, receiverAccountNumber, timestamp)
        VALUES (${i}, ${transferAmount}, '${transferReason}', '${receiverAccountNumber}', '${timestamp}')
      `;

      con.query(sharedTransferSql, (err, result) => {
        if (err) throw err;
      });
    }
  }

  console.log('Data inserted successfully');
  con.end();
};

createClientTable();

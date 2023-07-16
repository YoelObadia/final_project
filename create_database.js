const faker = require('faker');
const mysql = require('mysql2');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Yoyo5555badia()',
  port: 3306,
  database: 'fs7'
});

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
    insertData();
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

    const password = faker.internet.password();

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

    const password = faker.internet.password();

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

  console.log('Data inserted successfully');
  con.end();
};

createClientTable();

const admin = require('firebase-admin');
const faker = require('faker');
const serviceAccount = require('C:/Users/benchimol yechoua/Desktop/fullstack7-bank-firebase-adminsdk-fr7a4-c463e75376.json'); // Replace with your Firebase Admin SDK service account key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://console.firebase.google.com/u/0/project/fullstack7-bank/database/fullstack7-bank-default-rtdb/data'
});

const db = admin.firestore();

const formatDateForFirebase = (date) => {
  return admin.firestore.Timestamp.fromDate(new Date(date));
};

const createClientTable = async () => {
  const clientTableRef = db.collection('client');

  // Create client documents (10 default clients)
  for (let i = 0; i < 10; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const phone = '05' + faker.datatype.number({ min: 1000000000, max: 9999999999 });
    const email = faker.internet.email(firstName, lastName);
    const address = faker.address.streetAddress();
    const randomNumber = faker.datatype.number();
    const username = `${firstName}${randomNumber}`;

    const clientData = {
      firstname: firstName,
      lastname: lastName,
      phone: phone,
      email: email,
      address: address,
      username: username
    };

    const clientRef = await clientTableRef.add(clientData);

    // Create client password document
    const password = faker.datatype.number({ min: 100000, max: 999999 }).toString(); // 6-digit password
    const passwordData = {
      userId: clientRef.id,
      username: username,
      password: password
    };
    await db.collection('client_password').add(passwordData);

    // Create client account document
    const accountNumber = faker.datatype.number({ min: 100000, max: 999999 }).toString();
    const balance = faker.datatype.float({ min: 500, max: 10000 }).toFixed(2);
    const accountData = {
      userId: clientRef.id,
      username: username,
      accountNumber: accountNumber,
      balance: parseFloat(balance)
    };
    await db.collection('client_account').add(accountData);
  }

  console.log('Data inserted successfully');
};

const createAdminTable = async () => {
  const adminTableRef = db.collection('admin');

  // Create admin documents (3 default administrators)
  for (let i = 0; i < 3; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const phone = '05' + faker.datatype.number({ min: 1000000000, max: 9999999999 });
    const email = faker.internet.email(firstName, lastName);
    const address = faker.address.streetAddress();
    const randomNumber = faker.datatype.number();
    const username = `${firstName}${randomNumber}`;

    const adminData = {
      firstname: firstName,
      lastname: lastName,
      phone: phone,
      email: email,
      address: address,
      username: username
    };

    const adminRef = await adminTableRef.add(adminData);

    // Create admin password document
    const password = faker.datatype.number({ min: 100000, max: 999999 }).toString(); // 6-digit password
    const passwordData = {
      userId: adminRef.id,
      username: username,
      password: password
    };
    await db.collection('admin_password').add(passwordData);
  }

  console.log('Data inserted successfully');
};

const createDepositsTable = async () => {
  const depositsTableRef = db.collection('deposits');

  // Insert deposits for all clients
  const clients = await db.collection('client').get();

  clients.forEach(async (client) => {
    for (let j = 0; j < 5; j++) {
      const depositAmount = faker.datatype.float({ min: 100, max: 500 }).toFixed(2);
      const timestamp = formatDateForFirebase(new Date());

      const depositData = {
        userId: client.id,
        amount: parseFloat(depositAmount),
        timestamp: timestamp
      };

      await depositsTableRef.add(depositData);
    }
  });

  console.log('Data inserted successfully');
};

const createWithdrawalsCollection = async () => {
  const withdrawalsCollectionRef = db.collection('withdrawals');

  // Insert withdrawals for all clients
  const clients = await db.collection('client').get();

  clients.forEach(async (client) => {
    for (let k = 0; k < 5; k++) {
      const withdrawalAmount = faker.datatype.float({ min: 50, max: 200 }).toFixed(2);
      const timestamp = formatDateForFirebase(new Date());

      const withdrawalData = {
        userId: client.id,
        amount: parseFloat(withdrawalAmount),
        timestamp: timestamp
      };

      await withdrawalsCollectionRef.add(withdrawalData);
    }
  });

  console.log('Data inserted successfully');
};

const createReceivedTransfersCollection = async () => {
  const receivedTransfersCollectionRef = db.collection('received_transfers');

  // Insert received transfers for all clients
  const clients = await db.collection('client').get();

  clients.forEach(async (client) => {
    for (let l = 0; l < 5; l++) {
      const transferAmount = faker.datatype.float({ min: 100, max: 500 }).toFixed(2);
      const transferReason = faker.lorem.sentence();
      const senderAccountNumber = faker.datatype.number({ min: 100000, max: 999999 }).toString();
      const timestamp = formatDateForFirebase(new Date());

      const receivedTransferData = {
        userId: client.id,
        amount: parseFloat(transferAmount),
        reason: transferReason,
        senderAccountNumber: senderAccountNumber,
        timestamp: timestamp
      };

      await receivedTransfersCollectionRef.add(receivedTransferData);
    }
  });

  console.log('Data inserted successfully');
};

const createSharedTransfersCollection = async () => {
  const sharedTransfersCollectionRef = db.collection('shared_transfers');

  // Insert shared transfers for all clients
  const clients = await db.collection('client').get();

  clients.forEach(async (client) => {
    for (let m = 0; m < 5; m++) {
      const transferAmount = faker.datatype.float({ min: 100, max: 500 }).toFixed(2);
      const transferReason = faker.lorem.sentence();
      const receiverAccountNumber = faker.datatype.number({ min: 100000, max: 999999 }).toString();
      const timestamp = formatDateForFirebase(new Date());

      const sharedTransferData = {
        userId: client.id,
        amount: parseFloat(transferAmount),
        reason: transferReason,
        receiverAccountNumber: receiverAccountNumber,
        timestamp: timestamp
      };

      await sharedTransfersCollectionRef.add(sharedTransferData);
    }
  });

  console.log('Data inserted successfully');
};

// Add other table creation and data insertion functions following the same approach

const initializeDatabase = async () => {
  try {
    await createClientTable();
    await createAdminTable();
    await createDepositsTable();
    await createWithdrawalsCollection();
    await createReceivedTransfersCollection();
    await createSharedTransfersCollection();
    // Call other functions to create additional tables and insert data
  } catch (error) {
    console.error('Error:', error);
  } finally {
    admin.app().delete(); // Close the Firebase Admin SDK connection after all operations are done
  }
};

initializeDatabase();

const { MongoClient } = require('mongodb');
const { DB_USER, DB_PASS } = require('./config');

let database;

const mongoConnect = (callback) => {
  const uri = `mongodb+srv://ugrimov35335:YQ06pGp5J9uanOhV@cluster0.gg1lou2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

  MongoClient.connect(uri)
    .then(client => {
      console.log("Connection to the database has been established.");
      database = client.db('shop');
      callback();
    })
    .catch(err => {
      console.error('Ошибка подключения к базе данных:', err);
    });
};

const getDatabase = () => {
  if (!database) {
    throw new Error("No database found.");
  }
  return database;
};

module.exports = {
  mongoConnect,
  getDatabase
};

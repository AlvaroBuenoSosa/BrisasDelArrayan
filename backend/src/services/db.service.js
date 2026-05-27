const readDb = require('../utils/readDb');
const writeDb = require('../utils/writeDb');

function getCollection(name) {
  const db = readDb();
  return db[name] || [];
}

function getById(collection, id) {
  const db = readDb();

  return db[collection]?.find(
    item => item.id === Number(id)
  );
}

function createItem(collection, item) {
  const db = readDb();

  const newItem = {
    id: Date.now(),
    ...item
  };

  db[collection].push(newItem);

  writeDb(db);

  return newItem;
}

function deleteItem(collection, id) {
  const db = readDb();

  db[collection] = db[collection].filter(
    item => item.id !== Number(id)
  );

  writeDb(db);
}

module.exports = {
  getCollection,
  getById,
  createItem,
  deleteItem
};
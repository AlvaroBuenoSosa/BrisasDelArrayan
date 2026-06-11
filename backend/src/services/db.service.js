const readDb =
  require('../utils/readDb');

const writeDb =
  require('../utils/writeDb');

function getCollection(name) {

  const db = readDb();

  return db[name] || [];
}

function getById(
  collection,
  id
) {

  const db = readDb();

  return db[collection]?.find(
    item =>
      Number(item.id) === Number(id)
  );
}

function createItem(
  collection,
  item
) {

  const db = readDb();

  const newItem = {
    ...item,
    id: item.id || Date.now()
  };

  db[collection].push(newItem);

  writeDb(db);

  return newItem;
}

function updateItem(
  collection,
  id,
  updatedData
) {

  const db = readDb();

  const index =
    db[collection].findIndex(
      item =>
        Number(item.id) === Number(id)
    );

  if (index === -1) {
    return null;
  }

  db[collection][index] = {
    ...db[collection][index],
    ...updatedData,
    id: Number(id)
  };

  writeDb(db);

  return db[collection][index];
}

function deleteItem(
  collection,
  id
) {

  const db = readDb();

  db[collection] =
    db[collection].filter(
      item =>
        Number(item.id) !== Number(id)
    );

  writeDb(db);
}

function deleteByName(
  collection,
  name
) {

  const db = readDb();

  const before =
    db[collection].length;

  db[collection] =
    db[collection].filter(
      item => {

        const itemName =
          item.name ||
          item.nombre ||
          '';

        return (
          itemName.toLowerCase() !==
          name.toLowerCase()
        );
      }
    );

  writeDb(db);

  return (
    before -
    db[collection].length
  );
}

module.exports = {
  getCollection,
  getById,
  createItem,
  updateItem,
  deleteItem,
  deleteByName
};
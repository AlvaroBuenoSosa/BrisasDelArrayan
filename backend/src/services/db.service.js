const fs = require('fs');
const path = require('path');

const readDb =
  require('../utils/readDb');

const writeDb =
  require('../utils/writeDb');

const uploadDir = path.join(__dirname, '..', 'uploads');

function collectLocalUploadFilenames(value, set = new Set()) {
  if (Array.isArray(value)) {
    value.forEach(item => collectLocalUploadFilenames(item, set));
    return set;
  }

  if (value && typeof value === 'object') {
    Object.values(value).forEach(item => collectLocalUploadFilenames(item, set));
    return set;
  }

  if (typeof value !== 'string') {
    return set;
  }

  const match = value.match(/^(?:\/api\/uploads\/|api\/uploads\/)(.+)$/i);

  if (match) {
    const filename = path.basename(match[1]);
    if (filename) {
      set.add(filename);
    }
  }

  return set;
}

function deleteUploadFiles(item) {
  const filenames = collectLocalUploadFilenames(item);

  filenames.forEach(filename => {
    const filePath = path.join(uploadDir, filename);
    const resolvedPath = path.resolve(filePath);

    if (!resolvedPath.startsWith(path.resolve(uploadDir) + path.sep) && resolvedPath !== path.resolve(uploadDir)) {
      return;
    }

    try {
      if (fs.existsSync(resolvedPath)) {
        fs.unlinkSync(resolvedPath);
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error('Error deleting upload file:', resolvedPath, error);
      }
    }
  });
}

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

  const itemsToDelete =
    db[collection].filter(
      item =>
        Number(item.id) === Number(id)
    );

  itemsToDelete.forEach(deleteUploadFiles);

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

  const itemsToDelete =
    db[collection].filter(
      item => {

        const itemName =
          item.name ||
          item.nombre ||
          '';

        return (
          itemName.toLowerCase() ===
          name.toLowerCase()
        );
      }
    );

  itemsToDelete.forEach(deleteUploadFiles);

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
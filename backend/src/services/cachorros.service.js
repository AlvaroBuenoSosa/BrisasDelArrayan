const db = require('./db.service');

function getCachorros() {
  return db.getCollection('cachorros');
}

function getCachorroById(id) {
  return db.getById('cachorros', id);
}

function getByParents(padreId, madreId) {
  return getCachorros().filter(c =>
    c.padreId === Number(padreId) &&
    c.madreId === Number(madreId)
  );
}

module.exports = {
  getCachorros,
  getCachorroById,
  getByParents
};
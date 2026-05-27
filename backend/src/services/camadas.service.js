const db = require('./db.service');

function getCamadas() {
  return db.getCollection('camadas');
}

function getCamadaById(id) {
  return db.getById('camadas', id);
}

module.exports = {
  getCamadas,
  getCamadaById
};
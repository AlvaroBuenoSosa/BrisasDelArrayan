const db = require('./db.service');

function getCamadas() {
  return db.getCollection('camadas');
}

function getCamadaById(id) {
  return db.getById('camadas', id);
}

function createCamada(camada) {
  return db.createItem(
    'camadas',
    camada
  );
}

module.exports = {
  getCamadas,
  getCamadaById,
  createCamada
};
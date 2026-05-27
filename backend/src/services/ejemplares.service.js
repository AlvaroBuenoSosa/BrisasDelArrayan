const db = require('./db.service');

function getEjemplares() {
  return db.getCollection('ejemplares');
}

function getEjemplarById(id) {
  return db.getById('ejemplares', id);
}

function searchEjemplares(nombre) {
  return getEjemplares().filter(e =>
    e.nombre.toLowerCase().includes(nombre.toLowerCase())
  );
}

function createEjemplar(data) {
  return db.createItem('ejemplares', data);
}

module.exports = {
  getEjemplares,
  getEjemplarById,
  searchEjemplares,
  createEjemplar
};
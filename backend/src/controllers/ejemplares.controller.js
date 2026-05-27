const service = require('../services/ejemplares.service');

function getAll(req, res) {
  res.json(service.getEjemplares());
}

function getById(req, res) {

  const item = service.getEjemplarById(
    req.params.id
  );

  if (!item) {
    return res.status(404).json({
      error: 'Ejemplar not found'
    });
  }

  res.json(item);
}

function search(req, res) {

  const items = service.searchEjemplares(
    req.params.nombre
  );

  res.json(items);
}

function create(req, res) {

  const item = service.createEjemplar(
    req.body
  );

  res.status(201).json(item);
}

module.exports = {
  getAll,
  getById,
  search,
  create
};
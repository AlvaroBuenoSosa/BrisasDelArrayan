const service = require('../services/cachorros.service');

function getAll(req, res) {
  res.json(service.getCachorros());
}

function getById(req, res) {

  const item = service.getCachorroById(
    req.params.id
  );

  if (!item) {
    return res.status(404).json({
      error: 'Cachorro not found'
    });
  }

  res.json(item);
}

function getByParents(req, res) {

  const { padreId, madreId } = req.query;

  const data = service.getByParents(
    padreId,
    madreId
  );

  res.json(data);
}

function create(req, res) {

  const cachorro =
    service.createCachorro(req.body);

  res.status(201).json(cachorro);
}

module.exports = {
  getAll,
  getById,
  getByParents,
  create
};
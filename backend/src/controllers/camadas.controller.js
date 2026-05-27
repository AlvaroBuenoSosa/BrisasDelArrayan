const service = require('../services/camadas.service');

function getAll(req, res) {
  res.json(service.getCamadas());
}

function getById(req, res) {

  const item = service.getCamadaById(
    req.params.id
  );

  if (!item) {
    return res.status(404).json({
      error: 'Camada not found'
    });
  }

  res.json(item);
}

module.exports = {
  getAll,
  getById
};
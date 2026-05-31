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

function create(req, res) {

  const nuevaCamada = service.createCamada(
    req.body
  );

  res.status(201).json(
    nuevaCamada
  );
}

module.exports = {
  getAll,
  getById,
  create
};
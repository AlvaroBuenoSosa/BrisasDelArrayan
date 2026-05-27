const db = require('../services/db.service');

function create(req, res) {

  const { resource } = req.params;

  const item = db.createItem(
    resource,
    req.body
  );

  res.status(201).json(item);
}

function remove(req, res) {

  const { resource, id } = req.params;

  db.deleteItem(resource, id);

  res.status(204).send();
}

module.exports = {
  create,
  remove
};
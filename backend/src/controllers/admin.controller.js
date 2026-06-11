const db =
  require('../services/db.service');

function create(req, res) {

  const { resource } = req.params;

  const item = db.createItem(
    resource,
    req.body
  );

  res.status(201).json(item);
}

function update(req, res) {

  const { resource, id } = req.params;

  const updatedItem =
    db.updateItem(
      resource,
      id,
      req.body
    );

  if (!updatedItem) {

    return res.status(404).json({
      message: 'No encontrado'
    });
  }

  res.json(updatedItem);
}

function remove(req, res) {

  const { resource, id } = req.params;

  db.deleteItem(
    resource,
    id
  );

  res.status(204).send();
}

function removeByName(req, res) {

  const { resource, name } =
    req.params;

  const deleted =
    db.deleteByName(
      resource,
      decodeURIComponent(name)
    );

  res.json({
    deleted
  });
}

module.exports = {
  create,
  update,
  remove,
  removeByName
};
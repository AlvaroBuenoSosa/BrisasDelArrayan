const service = require('../services/pedigree.service');

function getPedigree(req, res) {

  const data = service.getPedigree(
    req.params.id
  );

  if (!data) {
    return res.status(404).json({
      error: 'Pedigree not found'
    });
  }

  res.json(data);
}

module.exports = {
  getPedigree
};
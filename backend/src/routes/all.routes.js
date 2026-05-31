const express = require('express');

const router = express.Router();

const db = require('../data/db.json');

router.get('/', (req, res) => {

  res.json({
    ejemplares: db.ejemplares,
    ejemplarespedigree: db.ejemplarespedigree,
    cachorros: db.cachorros,
    camadas: db.camadas
  });

});

module.exports = router;
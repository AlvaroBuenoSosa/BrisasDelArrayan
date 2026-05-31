const router = require('express').Router();

const controller = require('../controllers/camadas.controller');

router.get('/', controller.getAll);

router.get('/:id', controller.getById);

router.post('/', controller.create);

module.exports = router;
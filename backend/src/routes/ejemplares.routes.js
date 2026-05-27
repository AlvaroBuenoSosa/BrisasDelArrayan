const router = require('express').Router();

const controller = require('../controllers/ejemplares.controller');

router.get('/', controller.getAll);

router.get('/buscar/:nombre', controller.search);

router.get('/:id', controller.getById);

router.post('/', controller.create);

module.exports = router;
const router = require('express').Router();

const controller = require('../controllers/cachorros.controller');

router.get('/', controller.getAll);

router.get('/por-camada', controller.getByParents);

router.get('/:id', controller.getById);

module.exports = router;
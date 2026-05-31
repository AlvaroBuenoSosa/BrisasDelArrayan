const router = require('express').Router();

const controller = require('../controllers/cachorros.controller');

router.get('/', controller.getAll);

router.get('/:id', controller.getById);

router.get('/parents/search', controller.getByParents);

router.post('/', controller.create);

module.exports = router;
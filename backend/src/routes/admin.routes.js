const router = require('express').Router();

const controller = require('../controllers/admin.controller');

router.post('/:resource', controller.create);

router.delete('/:resource/:id', controller.remove);

module.exports = router;
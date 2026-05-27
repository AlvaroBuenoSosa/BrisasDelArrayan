const router = require('express').Router();

const controller = require('../controllers/pedigree.controller');

router.get('/:id', controller.getPedigree);

module.exports = router;
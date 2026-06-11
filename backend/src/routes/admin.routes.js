const router = require('express').Router();

const controller =
  require('../controllers/admin.controller');

router.post(
  '/:resource',
  controller.create
);

router.put(
  '/:resource/:id',
  controller.update
);

router.delete(
  '/:resource/:id',
  controller.remove
);

router.delete(
  '/:resource/name/:name',
  controller.removeByName
);

module.exports = router;
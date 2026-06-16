const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({

  destination(req, file, cb) {
    cb(null, uploadDir);
  },

  filename(req, file, cb) {

    const ext =
      file.originalname.split('.').pop();

    cb(
      null,
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      '.' +
      ext
    );
  }
});

const upload = multer({ storage });

router.post(
  '/',
  upload.array('files'),
  (req, res) => {

    const urls = req.files.map(
      f => `/api/uploads/${f.filename}`
    );

    res.json(urls);
  }
);

module.exports = router;
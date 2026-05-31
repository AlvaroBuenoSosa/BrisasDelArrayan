const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const dbPath = path.join(
  __dirname,
  '../data/db.json'
);

router.get('/', (req, res) => {

  const db = JSON.parse(
    fs.readFileSync(dbPath, 'utf8')
  );

  res.json(db.ejemplarespedigree || []);
});

router.post('/', (req, res) => {

  const db = JSON.parse(
    fs.readFileSync(dbPath, 'utf8')
  );

  db.ejemplarespedigree.push(req.body);

  fs.writeFileSync(
    dbPath,
    JSON.stringify(db, null, 2)
  );

  res.status(201).json(req.body);
});

module.exports = router;
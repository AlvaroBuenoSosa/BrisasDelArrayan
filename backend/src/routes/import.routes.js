const express = require('express');

const fs = require('fs');

const path = require('path');

const router = express.Router();

const {
  scrapeDog
} = require('../services/dachpedigree.service');

/*
|--------------------------------------------------------------------------
| TEST
|--------------------------------------------------------------------------
*/

router.get('/test', (req, res) => {

  res.json({
    ok: true
  });

});

/*
|--------------------------------------------------------------------------
| IMPORT DOG
|--------------------------------------------------------------------------
*/

router.post('/dachpedigree', async (req, res) => {

  try {

    const { url } = req.body;

    if (!url) {

      return res.status(400).json({
        error: 'URL requerida'
      });
    }

    const dog = await scrapeDog(url);

    const dbPath = path.join(
      __dirname,
      '../data/db.json'
    );

    const db = JSON.parse(
      fs.readFileSync(dbPath, 'utf8')
    );

    /*
    |--------------------------------------------------------------------------
    | CREAR ARRAY SI NO EXISTE
    |--------------------------------------------------------------------------
    */

    if (!db.ejemplarespedigree) {
      db.ejemplarespedigree = [];
    }

    /*
    |--------------------------------------------------------------------------
    | EVITAR DUPLICADOS
    |--------------------------------------------------------------------------
    */

    const exists = db.ejemplarespedigree.find(
      d => d.id === dog.id
    );

    if (!exists) {

      db.ejemplarespedigree.push(dog);

      fs.writeFileSync(
        dbPath,
        JSON.stringify(db, null, 2)
      );
    }

    res.json(dog);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Error importando perro'
    });
  }
});

module.exports = router;
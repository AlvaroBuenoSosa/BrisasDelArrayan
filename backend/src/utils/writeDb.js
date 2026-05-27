const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/db.json');

function writeDb(data) {
  fs.writeFileSync(
    DB_PATH,
    JSON.stringify(data, null, 2),
    'utf8'
  );
}

module.exports = writeDb;
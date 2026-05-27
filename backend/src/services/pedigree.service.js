const readDb = require('../utils/readDb');

function getPedigree(id) {

  const db = readDb();

  const ejemplar = db.ejemplares.find(
    e => e.id === Number(id)
  );

  if (!ejemplar) {
    return null;
  }

  const pedigree = [];

  function recursive(padreId, madreId) {

    const related = [
      ...db.ejemplares,
      ...db.ejemplarespedigree
    ].filter(
      e =>
        e.id === padreId ||
        e.id === madreId
    );

    related.forEach(r => {

      if (!pedigree.find(p => p.id === r.id)) {

        pedigree.push(r);

        recursive(r.padreId, r.madreId);
      }
    });
  }

  recursive(
    ejemplar.padreId,
    ejemplar.madreId
  );

  return {
    ejemplar,
    pedigree
  };
}

module.exports = {
  getPedigree
};
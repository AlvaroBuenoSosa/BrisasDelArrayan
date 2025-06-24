const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:4200', // Asegúrate de que este es el puerto correcto de tu app Angular
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Ruta para obtener todos los ejemplares
app.get('/api/ejemplares', (req, res) => {
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading database file');
    }
    const db = JSON.parse(data);
    const ejemplares = db.ejemplares; // Obtener solo la lista de ejemplares
    res.send(ejemplares); // Devolver la lista de ejemplares
  });
});

// Buscar ejemplares por nombre (por coincidencia exacta o parcial)
app.get('/api/ejemplares/buscar/:nombre', (req, res) => {
  const { nombre } = req.params;

  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error leyendo archivo de base de datos:', err);
      return res.status(500).send('Error interno del servidor');
    }

    let db;
    try {
      db = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).send('Error al parsear base de datos');
    }

    const resultados = db.ejemplares.filter(e =>
      e.nombre.toLowerCase().includes(nombre.toLowerCase())
    );

    if (resultados.length === 0) {
      return res.status(404).send('No se encontraron coincidencias');
    }

    res.json(resultados);
  });
});

app.get('/api/ejemplarespedigree', (req, res) => {
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading database file');
    }
    const db = JSON.parse(data);
    const ejemplarespedigree = db.ejemplarespedigree; // Obtener solo la lista de ejemplares
    res.send(ejemplarespedigree); // Devolver la lista de ejemplares
  });
});

app.get('/api/ejemplarespedigree/:id', (req, res) => {
  const { id } = req.params;

  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading database file:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    let db;
    try {
      db = JSON.parse(data);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return res.status(500).json({ error: 'Database file is corrupted' });
    }

    // Función recursiva para obtener pedigree, incluyendo ejemplares
    const obtenerPedigreeRelacionados = (padreId, madreId, pedigreeSet = new Set()) => {
      if (!padreId && !madreId) return [];

      // Buscar si padreId y madreId son de ejemplares o pedigrees
      const relacionados = db.ejemplares.filter(e =>
        (e.id === padreId || e.id === madreId) && !pedigreeSet.has(e.id)
      );

      // Si no se encuentra en ejemplares, buscar en ejemplarespedigree
      const pedigreeRelacionados = db.ejemplarespedigree.filter(p =>
        (p.id === padreId || p.id === madreId) && !pedigreeSet.has(p.id)
      );

      // Combinamos ambos resultados en un solo arreglo (ejemplares y pedigrees)
      const todosRelacionados = [...relacionados, ...pedigreeRelacionados];

      if (todosRelacionados.length === 0) {
        console.log(`No se encontraron ejemplares o pedigrees para PadreID: ${padreId} y MadreID: ${madreId}`);
      }

      // Agregar a pedigreeSet para evitar duplicados
      todosRelacionados.forEach(r => pedigreeSet.add(r.id));

      // Llamar recursivamente para buscar los pedigrees de estos ejemplares
      todosRelacionados.forEach(r => {
        obtenerPedigreeRelacionados(r.padreId, r.madreId, pedigreeSet);
      });

      // Convertir el Set en un arreglo de objetos pedigree
      return Array.from(pedigreeSet).map(id => {
        // Buscamos si el id pertenece a un ejemplar o a un pedigree
        const ejemplar = db.ejemplares.find(e => e.id === id);
        if (ejemplar) return ejemplar;  // Si encontramos un ejemplar
        return db.ejemplarespedigree.find(e => e.id === id);  // Si no, buscamos en pedigrees
      });
    };

    // Obtener el ejemplar inicial
    const ejemplar = db.ejemplares.find(e => e.id === parseInt(id, 10));

    if (!ejemplar) {
      return res.status(404).json({ error: 'Ejemplar not found' });
    }

    console.log(`Buscando pedigree para Ejemplar ID: ${ejemplar.id}, PadreID: ${ejemplar.padreId}, MadreID: ${ejemplar.madreId}`);

    // Obtenemos el pedigree relacionado con el ejemplar (usando padreId y madreId)
    const pedigreeRelacionados = obtenerPedigreeRelacionados(ejemplar.padreId, ejemplar.madreId);

    if (pedigreeRelacionados.length === 0) {
      return res.status(404).json({ error: 'No pedigree found for this ejemplar' });
    }

    // Respondemos tanto con el ejemplar como con los pedigrees encontrados
    res.json({
      ejemplar,       // Devolvemos el ejemplar original
      pedigree: pedigreeRelacionados  // Y los pedigrees relacionados
    });
  });
});



// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Server running on port 3000');
});

app.get('/api/camadas', (req, res) => {
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading database file:', err);
      return res.status(500).send('Error reading database file');
    }

    try {
      const db = JSON.parse(data);
      const camadas = db.camadas;

      if (!camadas) {
        return res.status(404).send('Camadas not found');
      }

      res.setHeader('Content-Type', 'application/json');
      res.send(camadas);
    } catch (err) {
      console.error('Error parsing JSON:', err);
      res.status(500).send('Error parsing database file');
    }
  });
});

app.get('/api/cachorros', (req, res) => {
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading database file:', err);
      return res.status(500).send('Error reading database file');
    }

    try {
      const db = JSON.parse(data);
      const cachorros = db.cachorros;

      if (!cachorros) {
        return res.status(404).send('Camadas not found');
      }

      res.setHeader('Content-Type', 'application/json');
      res.send(cachorros);
    } catch (err) {
      console.error('Error parsing JSON:', err);
      res.status(500).send('Error parsing database file');
    }
  });
});

app.get('/api/cachorros-por-camada', (req, res) => {
  const padreId = parseInt(req.query.padreId, 10);
  const madreId = parseInt(req.query.madreId, 10);

  if (isNaN(padreId) || isNaN(madreId)) {
    return res.status(400).json({ error: 'Parámetros padreId y madreId requeridos y deben ser números.' });
  }

  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error leyendo base de datos:', err);
      return res.status(500).send('Error interno del servidor');
    }

    let db;
    try {
      db = JSON.parse(data);
    } catch (parseErr) {
      console.error('Error al parsear JSON:', parseErr);
      return res.status(500).send('Error al parsear base de datos');
    }

    const cachorrosFiltrados = db.cachorros.filter(c =>
      c.padreId === padreId && c.madreId === madreId
    );

    res.json(cachorrosFiltrados);
  });
});


app.get('/api/ejemplares/:id', (req, res) => {
  const { id } = req.params;

  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading database file');
    }
    const db = JSON.parse(data);
    const ejemplar = db.ejemplares.find(e => e.id === parseInt(id, 10));

    if (!ejemplar) {
      return res.status(404).send('Ejemplar not found');
    }

    res.send(ejemplar);
  });
});

app.get('/api/cachorros/:id', (req, res) => {
  const { id } = req.params;

  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading database file');
    }
    const db = JSON.parse(data);
    const cachorros = db.cachorros.find(e => e.id === parseInt(id, 10));

    if (!cachorros) {
      return res.status(404).send('Ejemplar not found');
    }

    res.send(cachorros);
  });
});

app.get('/api/camadas/:id', (req, res) => {
  const { id } = req.params;

  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading database file');
    }
    const db = JSON.parse(data);
    const camadas = db.camadas.find(e => e.id === parseInt(id, 10));

    if (!camadas) {
      return res.status(404).send('Ejemplar not found');
    }

    res.send(camadas);
  });
});

// GET ALL DE LA BASE DE DATOS

app.get('/api/all', (req, res) => {
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading database file:', err);
      return res.status(500).send('Error reading database file');
    }

    try {
      const db = JSON.parse(data);
      res.setHeader('Content-Type', 'application/json');
      res.send(db);
    } catch (err) {
      console.error('Error parsing JSON:', err);
      res.status(500).send('Error parsing database file');
    }
  });
});

//POST PARA LA BASE DE DATOS Y ADMIN

app.post('/api/:resource', (req, res) => {
  const { resource } = req.params;
  const nuevoItem = req.body;

  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer db.json:', err);
      return res.status(500).send('Error interno del servidor');
    }

    let db;
    try {
      db = JSON.parse(data);
    } catch (parseErr) {
      console.error('Error al parsear JSON:', parseErr);
      return res.status(500).send('Error de formato en base de datos');
    }

    if (!db[resource]) {
      return res.status(400).send('Recurso no válido');
    }

    // Generar un nuevo ID único (puede mejorarse)
    const newId = Date.now();
    const nuevoConId = { id: newId, ...nuevoItem };
    db[resource].push(nuevoConId);

    fs.writeFile('db.json', JSON.stringify(db, null, 2), (err) => {
      if (err) {
        console.error('Error al escribir en db.json:', err);
        return res.status(500).send('Error al guardar el recurso');
      }

      res.status(201).json(nuevoConId);
    });
  });
});


app.post('/api/ejemplares', (req, res) => {
  const nuevoEjemplar = req.body;

  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading database file:', err);
      return res.status(500).send('Internal Server Error');
    }

    let db;
    try {
      db = JSON.parse(data);
    } catch (err) {
      return res.status(500).send('Error parsing database file');
    }

    // Generar ID nuevo si no existe
    nuevoEjemplar.id = Date.now();

    db.ejemplares.push(nuevoEjemplar);

    fs.writeFile('db.json', JSON.stringify(db, null, 2), err => {
      if (err) {
        console.error('Error writing to database file:', err);
        return res.status(500).send('Error saving data');
      }

      res.status(201).json(nuevoEjemplar);
    });
  });
});


// Ruta para eliminar un recurso por ID (ejemplares, camadas, cachorros, ejemplarespedigree)
app.delete('/api/data/:resource/:id', (req, res) => {
  const { resource, id } = req.params;

  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading database file');
    }
    const db = JSON.parse(data);
    const resourceData = db[resource];

    if (!resourceData) {
      return res.status(400).send('Resource not found');
    }

    const newResourceData = resourceData.filter(item => item.id !== parseInt(id, 10));

    if (newResourceData.length === resourceData.length) {
      return res.status(404).send('Resource not found');
    }

    db[resource] = newResourceData;

    fs.writeFile('db.json', JSON.stringify(db, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error writing to database file');
      }
      res.status(204).send(); // El recurso fue eliminado con éxito
    });
  });
});




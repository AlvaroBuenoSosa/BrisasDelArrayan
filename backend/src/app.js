const express = require('express');
const cors = require('cors');

const ejemplaresRoutes = require('./routes/ejemplares.routes');
const cachorrosRoutes = require('./routes/cachorros.routes');
const camadasRoutes = require('./routes/camadas.routes');
const pedigreeRoutes = require('./routes/pedigree.routes');
const adminRoutes = require('./routes/admin.routes');
const allRoutes = require('./routes/all.routes');
const importRoutes = require('./routes/import.routes');
const ejemplaresPedigreeRoutes = require('./routes/ejemplarespedigree.routes');

const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(cors(
  [
    'http://localhost:4200',
    'https://brisasdelarrayan.netlify.app'
  ]
));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ROUTES

app.use('/api/ejemplares', ejemplaresRoutes);

app.use('/api/cachorros', cachorrosRoutes);

app.use('/api/camadas', camadasRoutes);

app.use('/api/pedigree', pedigreeRoutes);

app.use('/api/admin', adminRoutes);

app.use('/api/all', allRoutes);

app.use('/api/import', importRoutes);

app.use('/api/ejemplarespedigree', ejemplaresPedigreeRoutes);

// ERROR HANDLER

app.use(errorMiddleware);

module.exports = app;
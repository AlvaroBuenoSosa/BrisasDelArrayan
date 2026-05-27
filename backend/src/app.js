const express = require('express');
const cors = require('cors');

const ejemplaresRoutes = require('./routes/ejemplares.routes');
const cachorrosRoutes = require('./routes/cachorros.routes');
const camadasRoutes = require('./routes/camadas.routes');
const pedigreeRoutes = require('./routes/pedigree.routes');
const adminRoutes = require('./routes/admin.routes');

const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use('/api/ejemplares', ejemplaresRoutes);
app.use('/api/cachorros', cachorrosRoutes);
app.use('/api/camadas', camadasRoutes);
app.use('/api/pedigree', pedigreeRoutes);
app.use('/api/admin', adminRoutes);

// ERROR HANDLER
app.use(errorMiddleware);

module.exports = app;
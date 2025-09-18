const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Importação das rotas
const authRoutes = require('../routes/auth');
const inscritosRoutes = require('../routes/inscritos');
const frequenciasRoutes = require('../routes/frequencias');
const certificadosRoutes = require('../routes/certificados');
const uploadsRoutes = require('../routes/uploads');
const declaracoesRoutes = require('../routes/declaracoes');
const relatoriosRoutes = require('../routes/relatorios');
const publicRoutes = require('../routes/public');

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/uploads', express.static(require('path').join(__dirname, '../uploads')));

// Definição das rotas da API
app.use('/api/uploads', uploadsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/inscritos', inscritosRoutes);
app.use('/api/frequencias', frequenciasRoutes);
app.use('/api/certificados', certificadosRoutes);
app.use('/api/declaracoes', declaracoesRoutes);
app.use('/api/relatorios', relatoriosRoutes);
app.use('/api/public', publicRoutes);

app.get('/', (req, res) => {
  res.send('API do Sistema de Eventos - Backend Seguro');
});

module.exports = app;

const express = require('express');
const router = express.Router();
const relatorioController = require('../controllers/relatorioController');


router.get('/inscritos', relatorioController.inscritos);
router.get('/frequencia', relatorioController.frequencia);
router.get('/certificados', relatorioController.certificados);
router.get('/declaracoes', relatorioController.declaracoes);

module.exports = router;

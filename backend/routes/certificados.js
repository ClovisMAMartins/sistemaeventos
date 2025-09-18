const express = require('express');
const router = express.Router();
const controller = require('../controllers/certificadoController');

router.post('/gerar', controller.gerar);
router.post('/enviar', controller.enviar);

module.exports = router;

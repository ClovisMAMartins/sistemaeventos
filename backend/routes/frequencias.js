const express = require('express');
const router = express.Router();
const controller = require('../controllers/frequenciaController');

router.post('/', controller.registrar);
router.get('/', controller.listarTodos);
router.get('/:inscrito_id', controller.listarPorInscrito);

module.exports = router;

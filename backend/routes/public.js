const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

// Endpoint público para consulta por hash
router.get('/consulta', publicController.consultaPorHash);

module.exports = router;

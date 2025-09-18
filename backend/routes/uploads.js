const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = file.fieldname + '_' + Date.now() + ext;
    cb(null, name);
  }
});

const upload = multer({ storage });

// Upload de imagens: logo, banner, certificado, assinatura
router.post('/logo', upload.single('logo'), (req, res) => {
  res.json({ filename: req.file.filename, path: `/uploads/${req.file.filename}` });
});

router.post('/banner', upload.single('banner'), (req, res) => {
  res.json({ filename: req.file.filename, path: `/uploads/${req.file.filename}` });
});

router.post('/certificado', upload.single('certificado'), (req, res) => {
  res.json({ filename: req.file.filename, path: `/uploads/${req.file.filename}` });
});

router.post('/assinatura', upload.single('assinatura'), (req, res) => {
  res.json({ filename: req.file.filename, path: `/uploads/${req.file.filename}` });
});

// Endpoint para obter imagem genérica caso não definida
router.get('/generica/:tipo', (req, res) => {
  const tipo = req.params.tipo;
  const genericaPath = path.join(__dirname, '../uploads', `generica_${tipo}.png`);
  if (fs.existsSync(genericaPath)) {
    res.sendFile(genericaPath);
  } else {
    res.status(404).json({ message: 'Imagem genérica não encontrada.' });
  }
});

module.exports = router;

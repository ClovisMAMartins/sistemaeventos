const Declaracao = require('../models/Declaracao');
const path = require('path');
const fs = require('fs');
const { sendMail } = require('../config/mailer');

// Gera a declaração em PDF
exports.gerar = async (req, res) => {
  try {
    const { nome, documento, evento, organizacao, dataInicio, dataFim, objetivo, local, data, email } = req.body;
    if (!nome || !documento || !evento || !organizacao || !dataInicio || !dataFim || !objetivo || !local || !data || !email) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    const arquivo = `${nome.replace(/\s+/g, '_')}_${Date.now()}_declaracao.pdf`;
    const { filePath, hash } = await Declaracao.gerarPDF({ nome, documento, evento, organizacao, dataInicio, dataFim, objetivo, local, data, arquivo });
    res.status(201).json({ arquivo: path.basename(filePath), hash });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao gerar declaração.' });
  }
};

// Envia a declaração por e-mail
exports.enviar = async (req, res) => {
  try {
    const { email, arquivo } = req.body;
    if (!email || !arquivo) {
      return res.status(400).json({ message: 'E-mail e arquivo são obrigatórios.' });
    }
    const filePath = path.join(__dirname, '../certificados', arquivo);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Arquivo não encontrado.' });
    }
    await sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Declaração de Participação',
      text: 'Segue em anexo sua declaração de participação no evento.',
      attachments: [{ filename: arquivo, path: filePath }]
    });
    res.json({ message: 'Declaração enviada com sucesso.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao enviar declaração.' });
  }
};

const Certificado = require('../models/Certificado');
const path = require('path');
const pool = require('../config/database_mysql'); // Assumindo que você usará MySQL como nos outros models
const fs = require('fs');
const { transporter, sendMail } = require('../config/mailer'); // Supondo que o transporter foi movido para um módulo

exports.gerar = async (req, res) => {
  try {
    // Expandido para receber todos os dados necessários
    const {
      nome, email, documento, inscrito_id, // Dados do participante
      evento, curso, data, dataInicio, dataFim, horas, topicos, local, // Dados do evento/curso
      nome_organizacao, coordenador, cargo, // Dados da organização e signatário
      assinatura_arquivo, logo_arquivo, banner_arquivo, certificado_bg_arquivo // Nomes dos arquivos de imagem
    } = req.body;

    const camposObrigatorios = { nome, email, curso, data, horas };
    for (const [campo, valor] of Object.entries(camposObrigatorios)) {
      if (!valor) {
        return res.status(400).json({ message: `O campo '${campo}' é obrigatório.` });
      }
    }

    const arquivo = `${nome.replace(/\s+/g, '_')}_${Date.now()}.pdf`;

    const paths_imagens = {
      assinatura: assinatura_arquivo ? path.join(__dirname, '../uploads', assinatura_arquivo) : null,
      logo: logo_arquivo ? path.join(__dirname, '../uploads', logo_arquivo) : null,
      banner: banner_arquivo ? path.join(__dirname, '../uploads', banner_arquivo) : null,
      certificadoBg: certificado_bg_arquivo ? path.join(__dirname, '../uploads', certificado_bg_arquivo) : null,
    };

    const pdfData = {
      nome, evento, data, horas, email, documento, curso, dataInicio, dataFim, topicos, local,
      nome_organizacao, coordenador, cargo, arquivo, paths_imagens
    };

    const { filePath, hash } = await Certificado.gerarPDF(pdfData);

    // Salvar no banco de dados
    const query = 'INSERT INTO certificados (inscrito_id, hash, coordenador, cargo_coordenador, assinatura, tipo, workload, periodo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const periodo = (dataInicio && dataFim) ? `${dataInicio} a ${dataFim}` : null;
    await pool.query(query, [inscrito_id, hash, coordenador, cargo, assinatura_arquivo, curso, horas, periodo]);

    res.status(201).json({ arquivo: path.basename(filePath), hash });
  } catch (err) {
    console.error('Erro ao gerar certificado:', err); // Log do erro para depuração
    res.status(500).json({ message: 'Ocorreu um erro interno ao gerar o certificado.' });
  }
};

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
      subject: 'Certificado de Participação',
      text: 'Segue em anexo seu certificado.',
      attachments: [{ filename: arquivo, path: filePath }]
    });

    res.json({ message: 'Certificado enviado com sucesso.' });
  } catch (err) {
    console.error('Erro ao enviar certificado por e-mail:', err); // Log do erro
    res.status(500).json({ message: 'Ocorreu um erro interno ao enviar o certificado.' });
  }
};

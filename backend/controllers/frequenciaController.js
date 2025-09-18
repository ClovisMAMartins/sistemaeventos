const Frequencia = require('../models/Frequencia');

exports.registrar = async (req, res) => {
  try {
    const { inscrito_id, data, presente } = req.body;
    if (!inscrito_id || !data) {
      return res.status(400).json({ message: 'inscrito_id e data são obrigatórios.' });
    }
    const freq = await Frequencia.registrar({ inscrito_id, data, presente: presente !== false });
    res.status(201).json(freq);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao registrar frequência.' });
  }
};

exports.listarPorInscrito = async (req, res) => {
  try {
    const { inscrito_id } = req.params;
    const lista = await Frequencia.listarPorInscrito(inscrito_id);
    res.json(lista);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar frequências.' });
  }
};

exports.listarTodos = async (req, res) => {
  try {
    const lista = await Frequencia.listarTodos();
    res.json(lista);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar frequências.' });
  }
};

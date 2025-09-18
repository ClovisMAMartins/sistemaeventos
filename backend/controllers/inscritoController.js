const Inscrito = require('../models/Inscrito');

exports.getAll = async (req, res) => {
  try {
    const inscritos = await Inscrito.findAll();
    res.json(inscritos);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar inscritos.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const inscrito = await Inscrito.findById(req.params.id);
    if (!inscrito) return res.status(404).json({ message: 'Inscrito não encontrado.' });
    res.json(inscrito);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar inscrito.' });
  }
};

exports.create = async (req, res) => {
  try {
    const { nome, email, telefone } = req.body;
    if (!nome || !email || !telefone) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    const inscrito = await Inscrito.create({ nome, email, telefone });
    res.status(201).json(inscrito);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar inscrito.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { nome, email, telefone } = req.body;
    const inscrito = await Inscrito.update(req.params.id, { nome, email, telefone });
    res.json(inscrito);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar inscrito.' });
  }
};

exports.delete = async (req, res) => {
  try {
    await Inscrito.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Erro ao deletar inscrito.' });
  }
};

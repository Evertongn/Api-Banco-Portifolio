const knex = require('../conexao')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const senhaJwt = require('../senhaJwt')

const encontrarUsuario = require('../ferramentas/encontrarUsuario')


const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        const usuarioEcontrado = await encontrarUsuario(email)

        if (usuarioEcontrado) {
            return res.status(400).json("O email já existe");
        }

        const hash = await bcrypt.hash(senha, 10)

        const dados = {
            nome,
            email,
            senha: hash
        }

        const usuario = await knex('usuarios').insert(dados)

        if (usuario.rowCount === 0) {
            return res.status(400).json("O usuário não foi cadastrado.");
        }

        return res.status(200).json("O usuario foi cadastrado com sucesso!");
    } catch (error) {
        return res.status(400).json({ mensagem: error.message })
    }


}

const logarUsuario = async (req, res) => {
    const { email, senha } = req.body;
    try {
        const usuario = await encontrarUsuario(email)
        if (!usuario) {
            return res.status(401).json({ mensagem: "Usuário e/ou senha inválido(s)." })
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha)

        if (!senhaValida) {
            return res.status(401).json({ mensagem: "Usuário e/ou senha inválido(s)." })
        }

        const token = jwt.sign({ id: usuario.id }, senhaJwt, {
            expiresIn: '8h',
        })

        const { senha: _, ...usuarioLogado } = usuario

        return res.json({ usuario: usuarioLogado, token })
    } catch (error) {
        return res.status(400).json({ mensagem: error.message })
    }

}

const detalharUsuario = async (req, res) => {
    const { senha: _, ...usuarioLogado } = req.usuario
    return res.status(200).json(usuarioLogado)
}

const atualizarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body
    const { id } = req.usuario
    try {
        const usuario = await encontrarUsuario(email)
        if (usuario) {
            return res.status(409).json({ mensagem: "O e-mail informado já está sendo utilizado por outro usuário." })
        }
        const hash = await bcrypt.hash(senha, 10)

        await knex('usuarios').update({ nome, email, senha: hash }).where('id', id)

        return res.status(204).json()
    } catch (error) {
        return res.status(400).json({ mensagem: error.message })
    }

}


module.exports = {
    cadastrarUsuario, detalharUsuario,
    atualizarUsuario, logarUsuario
}
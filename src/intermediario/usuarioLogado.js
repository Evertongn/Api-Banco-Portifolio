const knex = require('../conexao')
const senhaJwt = require('../senhaJwt')
const jwt = require('jsonwebtoken')

const usuarioLogado = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' })
    }

    const token = authorization.split(' ')[1]
    try {
        const { id } = jwt.verify(token, senhaJwt)

        const usuario = await knex('usuarios').where('id', id).first()

        if (!usuario) {
            return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' })
        }

        req.usuario = usuario

        next()
    } catch (error) {
        return res.status(400).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' })
    }
}




module.exports = usuarioLogado
const knex = require('../conexao')

const encontrarEmail = async (email) => {
    return await knex('usuarios').where('email', email).first()
}

module.exports = encontrarEmail

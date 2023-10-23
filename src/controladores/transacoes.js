const knex = require('../conexao')

const encontraTransacao = require('../ferramentas/encontraTransacao')

const listarTransacoes = async (req, res) => {
    try {
        const transacoes = await knex('transacoes')
            .join('categorias', 'transacoes.categoria_id', '=', 'categorias.id')
            .select(
                'transacoes.*',
                'categorias.id as categoria_id',
                'categorias.descricao as categoria_nome'
            )

        return res.status(200).json(transacoes)
    } catch (error) {
        return res.status(400).json({ mensagem: error.message })
    }
}

const listarTransacao = async (req, res) => {
    const { id } = req.params
    try {
        const transacoes = await knex('transacoes').where('id', id).first()
        if (!transacoes) {
            return res.status(400).json({ mensagem: "Transação não encontrada." })
        }

        return res.status(200).json(transacoes)
    } catch (error) {
        return res.status(400).json({ mensagem: error.message })
    }
}

const cadastrarTransacao = async (req, res) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body
    const { id } = req.usuario
    try {
        const categoriaIdExiste = await knex('categorias').where('id', categoria_id)
        if (!categoriaIdExiste) {
            return res.status(400).json({ mensagem: "Categoira invalida" })
        }
        const dados = {
            tipo,
            descricao,
            valor,
            data,
            categoria_id,
            usuario_id: id
        }
        const transacao = await knex('transacoes').returning('*').insert(dados)
        transacao[0].categoria_nome = categoriaIdExiste[0].descricao
        return res.status(201).json(transacao)

    } catch (error) {
        return res.status(400).json({ mensagem: error.message })
    }

}

const atualizarTransacao = async (req, res) => {
    const { id } = req.params
    const { descricao, valor, data, categoria_id, tipo } = req.body
    try {
        const validarTransacao = await encontraTransacao(id, req.usuario.id)
        if (validarTransacao) {
            return res.status(400).json({ mensagem: validarTransacao })
        }
        const categoriaIdExiste = await knex('categorias').where('id', categoria_id)
        if (!categoriaIdExiste) {
            return res.status(400).json({ mensagem: "Categoira invalida" })
        }
        const dados = {
            tipo,
            descricao,
            valor,
            data,
            categoria_id,
        }
        await knex('transacoes').update(dados).where('id', id)


        return res.status(204).json()

    } catch (error) {
        return res.status(400).json({ mensagem: error.message })

    }

}
const deletarTransacao = async (req, res) => {
    const { id } = req.params
    try {
        const transacao = await encontraTransacao(id, req.usuario.id)
        if (transacao) {
            return res.status(400).json({ mensagem: transacao })
        }
        await knex('transacoes').where('id', id).del()
        return res.status(204).json()
    } catch (error) {
        return res.status(400).json({ mensagem: error.message })

    }
}

const listarExtrato = async (req, res) => {
    try {
        const entrada = await knex('transacoes').
            where({ usuario_id: req.usuario.id, tipo: 'entrada' }).sum('valor')
        const saida = await knex('transacoes').
            where({ usuario_id: req.usuario.id, tipo: 'saida' }).sum('valor')
        if (entrada[0].sum === null) {
            entrada[0].sum = 0
        }
        if (saida[0].sum === null) {
            saida[0].sum = 0
        }

        return res.status(200).json({ entrada: entrada[0].sum, saida: saida[0].sum })
    } catch (error) {
        return res.status(400).json({ mensagem: error.message })

    }


}

module.exports = {
    listarTransacoes, listarTransacao, cadastrarTransacao,
    atualizarTransacao, deletarTransacao, listarExtrato
}
const kenx = require('../conexao')


const encontraTransacao = async (id, idUsuario) => {
    const transacao = await kenx('transacoes').where('id', id).first()
    if (!transacao) {
        return mensagem = "Transação não encontrada."
    }
    if (transacao.usuario_id !== idUsuario) {
        return mensagem = "Transação não encontrada."
    }
    return
}

module.exports = encontraTransacao

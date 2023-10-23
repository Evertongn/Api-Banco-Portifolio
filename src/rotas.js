const express = require('express')

const { cadastrarUsuario, detalharUsuario, atualizarUsuario, logarUsuario } = require('./controladores/usuario')

const usuarioLogado = require('./intermediario/usuarioLogado')

const listarCategorias = require('./controladores/categorias')

const { listarTransacoes, listarTransacao, cadastrarTransacao,
    atualizarTransacao, deletarTransacao, listarExtrato } = require('./controladores/transacoes')
const { schemaLoginUsuario, schemaUsuario } = require('./validacoes/squemaUsuarios')
const squemaTransacao = require('./validacoes/squemaTransacao')
const validarCorpoRequisicao = require('./intermediario/validarCorpo')
const rotas = express()


rotas.post('/usuario', validarCorpoRequisicao(schemaUsuario), cadastrarUsuario)

rotas.post('/login', validarCorpoRequisicao(schemaLoginUsuario), logarUsuario)

rotas.use(usuarioLogado)

rotas.get('/usuario', detalharUsuario)
rotas.put('/usuario', validarCorpoRequisicao(schemaUsuario), atualizarUsuario)

rotas.get('/categoria', listarCategorias)

rotas.get('/transacao', listarTransacoes)
rotas.get('/transacao/extrato', listarExtrato)
rotas.get('/transacao/:id', listarTransacao)
rotas.post('/transacao', validarCorpoRequisicao(squemaTransacao), cadastrarTransacao)
rotas.put('/transacao/:id', validarCorpoRequisicao(squemaTransacao), atualizarTransacao)
rotas.delete('/transacao/:id', deletarTransacao)



module.exports = rotas 
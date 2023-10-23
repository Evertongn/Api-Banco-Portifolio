const joi = require('joi')

const squemaTransacao = joi.object({
    descricao: joi.string().required().messages({
        'any.required': 'O campo descricao é obrigatório',
        'string.empty': 'O campo descricao é obrigatório',
    }),
    valor: joi.number().required().messages({
        'any.required': 'O campo valor é obrigatório',
        'number.empty': 'O campo valor é obrigatório',
    }),
    data: joi.date().required().messages({
        'any.required': 'O campo nome é obrigatório',
        'date.empty': 'O campo nome é obrigatório',
    }),
    categoria_id: joi.number().required().messages({
        'any.required': 'O campo nome é obrigatório',
        'number.empty': 'O campo nome é obrigatório',
    }),
    tipo: joi.string().valid('entrada', 'saida').required().messages({
        'any.required': 'O campo nome é obrigatório',
        'string.empty': 'O campo nome é obrigatório',
        'any.only': 'O campo {#label} deve ser igual a "entrada" ou "saida".'
    })
})


module.exports = squemaTransacao


/********************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o app e a model 
 * (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 07/10/2025
 * Autor: Julio Cesar
 * Versão: 1.0
 *******************************************************************************************/
// Import do arquivo DAO para manipular o CRUD no BD
const produtoraDAO = require('../../model/DAO/produtora.js')

// Import do arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

const listarProdutoras = async function () {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let result = await produtoraDAO.getSelectAllProducer()

        if (result) {
            if (result.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.gener = result

                return MESSAGE.HEADER
            } else {
                return MESSAGE.ERROR_NOT_FOUND
            }
        } else {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarProdutoraId = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            let result = await produtoraDAO.getSelectByIdProducer(parseInt(id))

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.gener = result

                    return MESSAGE.HEADER //200
                } else {
                    return MESSAGE.ERROR_NOT_FOUND
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] Inválido'
            return MESSAGE.ERROR_REQUIRED_FIELDS
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const inserirProdutora = async function (produtora, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
        try {
            if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
    
                // Chama a função de validação dos dados de cadastro
                let validarDados = await validarDadosProdutora(produtora)
    
                if (!validarDados) {
                    let result = await produtoraDAO.setInsertProducer(produtora)
                    if (result) {
    
                        // Chama a função para receber o id gerado no banco de dados 
                        let lastIdprodutora = await produtoraDAO.getSelectLastIdProducer()
    
                        if (lastIdprodutora) {
                            produtora.id = lastIdprodutora
    
                            MESSAGE.HEADER.status = MESSAGE.SUCESS_CREATED_ITEM.status
                            MESSAGE.HEADER.status_code = MESSAGE.SUCESS_CREATED_ITEM.status_code
                            MESSAGE.HEADER.message = MESSAGE.SUCESS_CREATED_ITEM.message
                            MESSAGE.HEADER.response = produtora
    
                            return MESSAGE.HEADER
                        }else{    

                            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
                        }
                    } else{
                        console.log(result)
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
                    }
                }else {
                    return validarDados
                }
            } else{
                return MESSAGE.ERROR_CONTENT_TYPE
            }
        } catch (error) {
            return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
        }
}

const atualizarProdutora = async function (produtora, id, contentType) {


    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        // Validação do content-type
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            // Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosProdutora(produtora)

            if (!validarDados) {

                // Chama a função para validar a consistencia do ID e verificar se existe no BD
                let validarId = await buscarProdutoraId(id)

                // Verifica se o id existe no banco de dados, caso exista, teremos o status 200
                if (validarId.status_code == 200) {

                    // Adicionando o ID no JSON com os dados do filme
                    produtora.id = parseInt(id)

                    // Chama a função para atualizar um filme
                    let result = await produtoraDAO.setUpdateProducer(produtora)

                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = produtora

                        return MESSAGE.HEADER //201
                    } else {
                        console.log(result)
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                } else {
                    return validarId // Retorno da função de buscarFilmeId (400 ou 404 ou 500)
                }

            } else {
                return validarDados //Retorno da função de validar dados o filme 400
            }

        } else
            return MESSAGE.ERROR_CONTENT_TYPE //415

    } catch (error) {
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500

    }
}

const validarDadosProdutora = async function (produtora) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (produtora.nome == '' || produtora.nome == null || produtora.nome == undefined || produtora.nome > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo -->Nome<-- Inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS
    } else if (produtora.fundador == '' || produtora.nome == null || produtora.fundador == undefined || produtora.fundador > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo -->fundador<-- Inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS
    } else if (produtora.data_fundacao == '' || produtora.data_fundacao == null || produtora.data_fundacao == undefined) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo -->Data de Fundação<-- Inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS
    } else if (produtora.presidente == '' || produtora.presidente == null || produtora.presidente == undefined || produtora.presidente > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo -->presidente<-- Inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS
    } else if (produtora.sede == '' || produtora.sede == null || produtora.sede == undefined || produtora.sede > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo -->sede<-- Inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS
    }
}
module.exports = {
    listarProdutoras,
    buscarProdutoraId,
    inserirProdutora,
    atualizarProdutora
}
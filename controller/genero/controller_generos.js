/********************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o app e a model 
 * (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 07/10/2025
 * Autor: Julio Cesar
 * Versão: 1.0
 *******************************************************************************************/
// Import do arquivo DAO para manipular o CRUD no BD
const generoDAO = require('../../model/DAO/genero.js')

// Import do arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

// Retorna uma lista de filmes
const listarGeneros = async function () {

    // Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    // não interfira em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        // Chama a função de DAO para retornar a lista de filmes
        let result = await generoDAO.getSelectAllGenrs()

        // console.log(result)
        if (result) {
            if (result.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.gener = result


                return MESSAGE.HEADER //200
            } else {
                return MESSAGE.ERROR_NOT_FOUND  //404
            }
        } else {
            console.log(result)
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarGeneroId = async function (id) {
    // Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    // não interfira em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    // console.log(isNaN(id))
    try {
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            // Chama a função para filtrar pelo id
            let result = await generoDAO.getSelectByIdGenrs(parseInt(id))

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.gener = result

                    return MESSAGE.HEADER //200

                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404
                }

            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }

        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] Inválido'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400

        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500    
    }
}

const inserirGenero = async function (genero, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            // Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosGenero(genero)

            if (!validarDados) {
                let result = await generoDAO.setInsertGenrs(genero)
                if (result) {

                    // Chama a função para receber o id gerado no banco de dados 
                    let lastIdGenero = await generoDAO.getSelectLastIdFilm()

                    if (lastIdGenero) {
                        genero.id = lastIdGenero

                        MESSAGE.HEADER.status = MESSAGE.SUCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response = genero

                        return MESSAGE.HEADER
                    }else{    
                        console.log(lastIdGenero)    
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

const validarDadosGenero = async function (genero) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (genero.nome == '' || genero.nome == null || genero.nome == undefined || genero.nome > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo Inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS
    }
}

module.exports = {
    listarGeneros,
    buscarGeneroId,
    inserirGenero
}

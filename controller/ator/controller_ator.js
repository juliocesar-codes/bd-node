/********************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o app e a model 
 * (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 07/10/2025
 * Autor: Julio Cesar
 * Versão: 1.0
 *******************************************************************************************/

// Import do arquivo DAO para manipular o CRUD no BD
const atorDAO = require('../../model/DAO/ator.js')

// Import do arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

const listarAtores = async function () {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let result = await atorDAO.getSelectAllActor()

        if (result) {
            if (result.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.ator = result

                return MESSAGE.HEADER

            } return MESSAGE.ERROR_NOT_FOUND
        } else
            console.log(result)
        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarAtoresById = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            let result = await atorDAO.getSelectAllActorById(parseInt(id))

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.ator = result

                    return MESSAGE.HEADER
                } else {
                    return MESSAGE.ERROR_NOT_FOUND
                }
            } else {
                console.log(result)
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL

            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] Inválido'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const inserirAtor = async function (ator, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = await validarDadosAtor(ator)

            if (!validarDados) {

                let result = await atorDAO.setInsertActor(ator)
                console.log(result)
                if (result) {
                    let lastIdAtor = await atorDAO.getSelectLastIdActor()

                    if (lastIdAtor) {
                        ator.id = lastIdAtor

                        MESSAGE.HEADER.status = MESSAGE.SUCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response = ator

                        return MESSAGE.HEADER
                    } else {

                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
                    }
                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
                }
            } else {
                return validarDados
            }
        } else {
            console.log(contentType)
            return MESSAGE.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarAtor = async function (ator, id, contentType) {


    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = await validarDadosAtor(ator)

            if (!validarDados) {

                let validarId = await listarAtoresById(id)

                if (validarId.status_code == 200) {

                    ator.id = parseInt(id)

                    let result = await atorDAO.setUpdateActors(ator)

                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = ator

                        return MESSAGE.HEADER //201
                    } else {
                        console.log(result)
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                } else {
                    return validarId // Retorno da função (400 ou 404 ou 500)
                }

            } else {
                return validarDados //Retorno da função de validar dados 400
            }

        } else
            return MESSAGE.ERROR_CONTENT_TYPE //415

    } catch (error) {
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500

    }
}


const deletarAtor = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let validarID = await listarAtoresById(id)

        if (validarID.status_code == 200) {
            let result = await atorDAO.setDeleteActor(id)

            if (result) {
                MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.ator = result

                return MESSAGE.HEADER //200
            }else{
                console.log(result)
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
            }
        }else{
            return validarID
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}



const validarDadosAtor = async function (ator) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (ator.nome == '' || ator.nome == null || ator.nome == undefined || ator.nome.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (ator.data_nascimento == undefined) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [data_nascimento] inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (ator.nacionalidade == undefined || ator.nacionalidade == '' || ator.nacionalidade == null) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [DATA DE LANÇAMENTO] inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (ator.genero == '' || ator.genero == null || ator.genero == undefined) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [DURAÇÃO] inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (ator.email == '' || ator.email == null || ator.email == undefined ) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ORÇAMENTO] inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (ator.telefone == undefined || ator.telefone.length > 200) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [telefone] inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400  

    } else if (ator.endereco == '' || ator.endereco == null || ator.endereco == undefined) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [endereco] inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (ator.altura == '' || ator.altura == null || ator.altura == undefined) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [altura] inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (ator.peso == '' || ator.peso == null || ator.peso == undefined) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [peso] inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else {
        return false
    }
}

module.exports = {
    listarAtores,
    listarAtoresById,
    inserirAtor,
    atualizarAtor,
    deletarAtor
}
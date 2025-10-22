/********************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o app e a model 
 * (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 07/10/2025
 * Autor: Julio Cesar
 * Versão: 1.0
 *******************************************************************************************/

// Import do arquivo DAO para manipular o CRUD no BD
const personagemDAO = require('../../model/DAO/personagem.js')

// Import do arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

const listarPersonagens = async function () {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let result = await personagemDAO.getSelectAllPersona()

        if (result) {
            if (result.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.persona = result

                return MESSAGE.HEADER

            } return MESSAGE.ERROR_NOT_FOUND
        } else
        console.log(result)
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarPersonagensById = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            let result = await personagemDAO.getSelectAllPersonaById(parseInt(id))

            if(result){
                if (result.length > 0 ) {
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.gener = result

                    return MESSAGE.HEADER
                } else{
                    return MESSAGE.ERROR_NOT_FOUND
                }
            } else{
                console.log(result)
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
               
            }
        } else{
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] Inválido'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const inserirPersonagem = async function (personagem, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = await validarDadosPersonagem(personagem)

            if (!validarDados) {

                let result = await personagemDAO.setInsertPersona(personagem)
                if (result) {
                    let lastIdFilme = await personagemDAO.getSelectLastIdFilm()

                    if (lastIdFilme) {
                        personagem.id = lastIdFilme

                        MESSAGE.HEADER.status = MESSAGE.SUCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response = personagem

                        return MESSAGE.HEADER
                    } else {
                        console.log(lastIdFilme)
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

const atualizarPersonagem = async function (personagem, id, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let validarDados = await validarDadosPersonagem(personagem)

            if (!validarDados) {
                let validarId = await listarPersonagensById(id)

                if (validarId.status_code == 200) {
                    personagem.id = parseInt(id)

                    let result = await personagemDAO.setUpdatePersona(personagem)

                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = personagem

                        return MESSAGE.HEADER
                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
                    }
                } else {
                    return validarId
                }
            } else {
                return validarDados
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const validarDadosPersonagem = async function (personagem) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    
        if (personagem.nome == '' || personagem.nome == null || personagem.nome == undefined || personagem.nome > 100) {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo -->Nome<-- Inválido'
            return MESSAGE.ERROR_REQUIRED_FIELDS
        }else if (personagem.apelido == '' || personagem.apelido == undefined || personagem.apelido > 100) {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo -->historia<-- Inválido'
            return MESSAGE.ERROR_REQUIRED_FIELDS
        }else if (personagem.historia == '' || personagem.historia == null || personagem.historia == undefined) {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo -->ocupacao<-- Inválido'
            return MESSAGE.ERROR_REQUIRED_FIELDS
        }else if (personagem.ocupacao == '' || personagem.ocupacao == null || personagem.ocupacao == undefined || personagem.ocupacao > 100) {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo -->especie<-- Inválido'
            return MESSAGE.ERROR_REQUIRED_FIELDS
        }else if (personagem.especie == '' || personagem.especie == null || personagem.especie == undefined || personagem.especie > 100) {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo -->imagem<-- Inválido'
            return MESSAGE.ERROR_REQUIRED_FIELDS
        }else if (personagem.imagem == '' || personagem.imagem == null || personagem.imagem == undefined || personagem.imagem > 100) {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo -->idade<-- Inválido'
            return MESSAGE.ERROR_REQUIRED_FIELDS
        }else if (personagem.idade == '' || personagem.idade == null || personagem.idade == undefined || personagem.idade > 100 || typeof (personagem.idade) != 'number') {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo -->Nome<-- Inválido'
            return MESSAGE.ERROR_REQUIRED_FIELDS
        }
}
/***
 * CREATE TABLE tbl_personagem (
	id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    apelido VARCHAR(100) NULL,
    historia TEXT NOT NULL,
    idade INT NULL,
    ocupacao VARCHAR(100) NOT NULL,
    especie VARCHAR(100) NOT NULL,
    imagem VARCHAR(100) NOT NULL
);
 */
module.exports = {
    listarPersonagens,
    listarPersonagensById,
    inserirPersonagem,
    atualizarPersonagem
}
/********************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o app e a model 
 * (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 07/10/2025
 * Autor: Julio Cesar
 * Versão: 1.0
 *******************************************************************************************/
// Import do arquivo DAO para manipular o CRUD no BD
const filmeDAO = require('../../model/DAO/filme.js')

// Import do arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

// Retorna uma lista de filmes
const listarFilmes = async function () {

    // Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    // não interfira em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        // Chama a função de DAO para retornar a lista de filmes
        let result = await filmeDAO.getSelectAllFilms()

        // console.log(result)
        if (result) {
            if (result.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.films = result

                return MESSAGE.HEADER //200
            } else {
                return MESSAGE.ERROR_NOT_FOUND  //404
            }
        } else {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Retorna um filme filtrando pelo id
const buscarFilmeId = async function (id) {
    // Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    // não interfira em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    // console.log(isNaN(id))
    try {
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            // Chama a função para filtrar pelo id
            let result = await filmeDAO.getSelectByIdFilms(parseInt(id))

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film = result

                    return MESSAGE.HEADER //200

                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404
                }

            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }

        } else {
            return MESSAGE.ERROR_REQUIRED_FIELDS //400

        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500    
    }
}

// Insere um novo filme
const inserirFilme = async function (filme) {

}

// Atualiza um filme filtrando pelo id
const atualizarFilme = async function (filme, id) {

}

// Apaga um filme filtrando pelo id
const excluirFilme = async function (id) {

}

module.exports = {
    listarFilmes,
    buscarFilmeId
}
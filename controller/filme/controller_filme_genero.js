/**************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o app e a model para o CRUD de Filme e Genero
 * (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 05/11/2025
 * Autor: Julio Cesar
 * Versão: 1.0
 **************************************************************************************************************/
// Import do arquivo DAO para manipular o CRUD no BD
const filmeGeneroDAO = require('../../model/DAO/filme_genero.js')

// Import do arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

// Retorna uma lista de filmes e Generos
const listarFilmesGeneros = async function () {

    // Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    // não interfira em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        // Chama a função de DAO para retornar a lista de filmes
        let result = await filmeGeneroDAO.getSelectAllFilmsGenres()

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

// Retorna um filme genero pelo ID
const buscarFilmeGeneroId = async function (id) {
    // Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    // não interfira em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    // console.log(isNaN(id))
    try {
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            // Chama a função para filtrar pelo id
            let result = await filmeGeneroDAO.getSelectByIdFilmGenrs(parseInt(id))

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.filmes_generos = result

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

// Retorna os Generos filtrando pelo ID do filme
const listarGenerosIdFilme = async function (idFilme) {
    // Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    // não interfira em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    // console.log(isNaN(id))
    try {
        if (idFilme != '' && idFilme != null && idFilme != undefined && !isNaN(idFilme) && idFilme > 0) {
            // Chama a função para filtrar pelo id
            let result = await filmeGeneroDAO.getSelectGenresByIdFilms(parseInt(idFilme))

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.filmes_generos = result

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

const listarFilmesIdGenero = async function (idGenero) {
    // Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    // não interfira em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    // console.log(isNaN(id))
    try {
        if (idGenero != '' && idGenero != null && idGenero != undefined && !isNaN(idGenero) && idGenero > 0) {
            // Chama a função para filtrar pelo id
            let result = await filmeGeneroDAO.getSelectFilmsByIdGenres(parseInt(idGenero))

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.filmes_generos = result

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

const inserirFilmeGenero = async function (filmeGenero, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            // Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosFilmeGenero(filmeGenero)

            if (!validarDados) {
                let result = await filmeGeneroDAO.setInsertFilmsGenres(filmeGenero)
                if (result) {

                    // Chama a função para receber o id gerado no banco de dados 
                    let lastIdFilmeGenero = await filmeGeneroDAO.getSelectLastId()

                    if (lastIdFilmeGenero) {
                        filmeGenero.id = lastIdFilmeGenero

                        MESSAGE.HEADER.status = MESSAGE.SUCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response = filmeGenero

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
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarFilmeGenero = async function (filmeGenero, id, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
             let validarDados = await validarDadosfilmeGenero(filmeGenero)

             if (!validarDados) {
                let validarId = await buscarFilmeGeneroId(id)

                if (validarId.status_code == 200) {
                    filmeGenero.id = parseInt(id)

                    let result = await filmeGeneroDAO.setUpdateFilmsGenres(filmeGenero)

                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = filmeGenero

                        return MESSAGE.HEADER
                    }else{
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
                    }
                }else{
                    return validarId
                }
             } else{
                return validarDados
             }
        }else{
            console.log(contentType)
            return MESSAGE.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const deletarFilmeGenero = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    // console.log(isNaN(id))
    try {
        let validarID = await buscarFilmeGeneroId(id)
        
                if (validarID.status_code == 200) {
                    let result = await filmeGeneroDAO.setDeleteFilmsGenres(id)

            if (result) {
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.filme_genero = result

                    return MESSAGE.HEADER //200

                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //404
                }

            } else {
                return validarID //500
            }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500    
    }
}

const validarDadosFilmeGenero = async function (filmeGenero) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (filmeGenero.id_filme == '' || filmeGenero.id_filme == null || filmeGenero.id_filme == undefined || isNaN(filmeGenero.id_filme) || filmeGenero.id_filme <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_FILME] inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS
    }else if (filmeGenero.id_genero == '' || filmeGenero.id_genero == null || filmeGenero.id_genero == undefined || isNaN(filmeGenero.id_genero) || filmeGenero.id_genero <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_GENERO] Inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS 
        
    }
}

module.exports = {
    listarFilmesGeneros,
    buscarFilmeGeneroId,
    listarGenerosIdFilme,
    listarFilmesIdGenero,
    inserirFilmeGenero,
    atualizarFilmeGenero,
    deletarFilmeGenero
}

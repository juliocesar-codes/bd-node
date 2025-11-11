/********************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o app e a model 
 * (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 07/10/2025
 * Autor: Julio Cesar
 * Versão: 1.0
 *******************************************************************************************/
// Import do arquivo DAO para manipular o CRUD no BD
const filmeDAO = require('../../model/DAO/filme.js')

// Import da controller filmeGenero (tabela de relação)
const controllerFilmeGenero = require('./controller_filme_genero.js')

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

                for(filme of result){
                    let generoFilme = await controllerFilmeGenero.listarGenerosIdFilme(filme.id)
                    if (generoFilme.status_code != 200) {
                        filme.genero = []
                    }else{
                        filme.genero = generoFilme.response.filmes_generos
                    }
                }

                return MESSAGE.HEADER //200
            } else {
                return MESSAGE.ERROR_NOT_FOUND  //404
            }
        } else {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        console.log(error)
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

                    for(filme of result){
                        let generoFilme = await controllerFilmeGenero.listarGenerosIdFilme(filme.id)
                        if (generoFilme.status_code != 200) {
                            filme.genero = []
                        }else{
                            filme.genero = generoFilme.response.filmes_generos
                        }
                    }

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

// Insere um novo filme
const inserirFilme = async function (filme, contentType) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            // Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosFilme(filme)

            if (!validarDados) {
                let result = await filmeDAO.setInsertFilms(filme)
                if (result) {

                    // Chama a função para receber o id gerado no banco de dados 
                    let lastIdFilme = await filmeDAO.getSelectLastIdFilm()

                    if (lastIdFilme) {

                        // Processamento para inserir dados na tabela de relação entre filme e genero

                        // Repetição para pegar cada genero e enviar para o DAO do filmeGenero
                        //filme.genero.forEach(async function(genero){
                        for(genero of filme.genero){
                            let filmeGenero = {
                                id_filme: lastIdFilme,
                                id_genero: genero.id

                            }

                            let resultFilmeGenero = await controllerFilmeGenero.inserirFilmeGenero(filmeGenero, contentType)
                            if(resultFilmeGenero.status_code != 201){
                                return MESSAGE.ERROR_RELATION_TABLE //200 porém com problemas na tabela de relação 
                            }
                        }

                        // Adiciona no JSON de filme o ID que foi gerado pelo banco de dados
                        filme.id = lastIdFilme

                        MESSAGE.HEADER.status = MESSAGE.SUCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_CREATED_ITEM.message
                        
                        // Processamento para trazer dados do generos cadastrados na tabela de relação

                        // Apaga o atributo genero que chegou no POST apenas com IDs
                        delete filme.genero

                        // Pesquisa no BD quais os generos e os seus dados que foram inseridos na tabela de relaão
                        
                        let resultGenerosFilme = await controllerFilmeGenero.listarGenerosIdFilme(lastIdFilme)

                        // Adiciona novamente o atributo genero com todas as informações do genero (ID, Nome)
                        filme.genero = resultGenerosFilme.response.filmes_generos

                        MESSAGE.HEADER.response = filme


                        return MESSAGE.HEADER //201
                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
                    }
                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            } else {
                return validarDados //400
            }

            // Chama a função do DAO para inserir um novo filme
        } else
            return MESSAGE.ERROR_CONTENT_TYPE //415

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500

    }
}

// Atualiza um filme filtrando pelo id
const atualizarFilme = async function (filme, id, contentType) {


    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        // Validação do content-type
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            // Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosFilme(filme)

            if (!validarDados) {

                // Chama a função para validar a consistencia do ID e verificar se existe no BD
                let validarId = await buscarFilmeId(id)

                // Verifica se o id existe no banco de dados, caso exista, teremos o status 200
                if (validarId.status_code == 200) {

                    // Adicionando o ID no JSON com os dados do filme
                    filme.id = parseInt(id)

                    // Chama a função para atualizar um filme
                    let result = await filmeDAO.setUpdateFilms(filme)

                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = filme

                        return MESSAGE.HEADER //201
                    } else {
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
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500

    }
}

// Apaga um filme filtrando pelo id
const excluirFilme = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        let validarID = await buscarFilmeId(id)

        if (validarID.status_code == 200) {
            let result = await filmeDAO.setDeleteFilms(id)

            if (result) {
                MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.film = result

                return MESSAGE.HEADER
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
            }
        } else {
            return validarID
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Validação dos dados de cadastro do filme
const validarDadosFilme = async function (filme) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (filme.nome == '' || filme.nome == null || filme.nome == undefined || filme.nome.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (filme.sinopse == undefined) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [SINOPSE] inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (filme.data_lancamento == undefined || filme.data_lancamento.length != 10) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [DATA DE LANÇAMENTO] inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (filme.duracao == '' || filme.duracao == null || filme.duracao == undefined || filme.duracao > 8) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [DURAÇÃO] inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (filme.orcamento == '' || filme.orcamento == null || filme.orcamento == undefined || typeof (filme.orcamento) != 'number') {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ORÇAMENTO] inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (filme.trailer == undefined || filme.trailer.length > 200) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [TRAILER] inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400  

    } else if (filme.capa == '' || filme.capa == null || filme.capa == undefined || filme.capa.length > 200) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [CAPA] inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else {
        return false
    }
}

module.exports = {
    listarFilmes,
    buscarFilmeId,
    inserirFilme,
    atualizarFilme,
    excluirFilme
}
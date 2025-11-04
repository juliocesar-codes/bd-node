/***********************************************************************************************************************************
 * Objetivo: API responsável pelas requisições da API do projeto da locadora de filmes
 * Data: 07/10/2025
 * Autor: Julio Cesar Santana Alves
 * Versão: 1.0
 * 
 * Observações: Instalar dependencias para criar a API
 *      express - npm install express --save Instala as dependecias para criar uma API
 *      cors    - npm install cors --save Instala as dependecias para configurar as permissões da API
 *      body-parser - npm install body-parser --save Instala as dependecias para receber os tipos de dados via POST ou PUT
************************************************************************************************************************************/

// Import das dependencias
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

// Cria um objeto especialista no formato JSON para receber os dados do body (POST E PUT)
const bodyParserJSON = bodyParser.json()

// Definir porta padrão 
const PORT = process.env.PORT || 8080

// Instancia na classe do express
const router = express.Router()

const controllerAtor = require('../controller/ator/controller_ator')

// Request -> Recebe os Dados da Requisição
// Response -> Envia os Dados na API

router.get('/', async function (request, response) {
    let ator = await controllerAtor.listarAtores()

    response.status(ator.status_code)
    response.json(ator)
})

router.get('/:id', async function (request, response) {
    let idAtor = request.params.id

    let ator = await controllerAtor.listarAtoresById(idAtor)

    response.status(ator.status_code)
    response.json(ator)
})

router.post('/', bodyParserJSON, async function (request, response) {
    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let ator = await controllerAtor.inserirAtor(dadosBody, contentType)

    response.status(ator.status_code)
    response.json(ator)
})

router.put('/:id', bodyParserJSON, async function (request, response) {
    // Recebe os dados do body
    let dadosBody = request.body

    // Recebe o id do filme encaminhado pelo URL
    let idAtor = request.params.id

    // Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    let ator = await controllerAtor.atualizarAtor(dadosBody, idAtor, contentType)

    response.status(ator.status_code)
    response.json(ator)
})

router.delete('/:id', async function (request, response) {
    let idAtor = request.params.id

    let ator = await controllerAtor.deletarAtor(idAtor)

    response.status(ator.status_code)
    response.json(ator)
})

module.exports = router
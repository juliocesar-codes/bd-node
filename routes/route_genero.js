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

const controllerGenero = require('../controller/genero/controller_generos')

router.get('/', async function (request, response) {
    // Chama a função da controller para retornar todos os filmes
    let genero = await controllerGenero.listarGeneros()

    response.status(genero.status_code)
    response.json(genero)
})

// End Point que retorna um genero pelo id Inserido
router.get('/:id', async function (request, response) {
    // Recebe o id enviado na requisição via parametro
    let idGenero = request.params.id

    // Chama a função da controller para retornar todos os filmes
    let genero = await controllerGenero.buscarGeneroId(idGenero)

    response.status(genero.status_code)
    response.json(genero)
})

// Insere um novo genero no banco de dados
router.post('/', bodyParserJSON, async function (request, response) {
    // Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    // Recebe o content type da requisição
    let contentType = request.headers['content-type']

    // Chama a função da controller para inserir o filme, enviamos os dados do body e o content-type
    let genero = await controllerGenero.inserirGenero(dadosBody, contentType)

    response.status(genero.status_code)
    response.json(genero)
})

router.put('/:id', bodyParserJSON, async function (request, response) {
    // Recebe os dados do body
    let dadosBody = request.body

    // Recebe o id do filme encaminhado pelo URL
    let idGenero = request.params.id

    // Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    let genero = await controllerGenero.atualizarGenero(dadosBody, idGenero, contentType)

    response.status(genero.status_code)
    response.json(genero)


})

router.delete('/:id', async function (request, response) {
    let idGenero = request.params.id

    let genero = await controllerGenero.deletarGenero(idGenero)

    response.status(genero.status_code)
    response.json(genero)
})

module.exports = router
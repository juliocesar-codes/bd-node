const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

// Cria um objeto especialista no formato JSON para receber os dados do body (POST E PUT)
const bodyParserJSON = bodyParser.json()

// Definir porta padrão 
const PORT = process.env.PORT || 8080

// Instancia na classe do express
const router = express.Router()

const controllerPersonagem = require('../controller/personagem/controller_personagem.js')


router.get('/', async function (request, response) {
    let personagem = await controllerPersonagem.listarPersonagens()

    response.status(personagem.status_code)
    response.json(personagem)
})

router.get('/:id', async function (request, response) {
    let idPersonagem = request.params.id

    let personagem = await controllerPersonagem.listarPersonagensById(idPersonagem)

    response.status(personagem.status_code)
    response.json(personagem)
})

router.post('/', bodyParserJSON, async function (request, response) {
    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let personagem = await controllerPersonagem.inserirPersonagem(dadosBody, contentType)

    response.status(personagem.status_code)
    response.json(personagem)
})

router.put('/:id', bodyParserJSON, async function (request, response) {
    // Recebe os dados do body
    let dadosBody = request.body

    // Recebe o id do filme encaminhado pelo URL
    let idPersonagem = request.params.id

    // Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    let personagem = await controllerPersonagem.atualizarPersonagem(dadosBody, idPersonagem, contentType)

    response.status(personagem.status_code)
    response.json(personagem)
})

router.delete('/:id', async function (request, response) {
    let idPersonagem = request.params.id

    let personagem = await controllerPersonagem.deletarPersonagem(idPersonagem)

    response.status(personagem.status_code)
    response.json(personagem)
})

module.exports = router
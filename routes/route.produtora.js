const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

// Cria um objeto especialista no formato JSON para receber os dados do body (POST E PUT)
const bodyParserJSON = bodyParser.json()

// Definir porta padrão 
const PORT = process.env.PORT || 8080

// Instancia na classe do express
const router = express.Router()

const controllerProdutora = require('../controller/produtora/controller_produtora.js')

router.get('/', async function (request, response) {
    let produtora = await controllerProdutora.listarProdutoras()

    response.status(produtora.status_code)
    response.json(produtora)
})

router.get('/:id', async function (request, response) {
    let idProdutora = request.params.id

    let produtora = await controllerProdutora.buscarProdutoraId(idProdutora)

    response.status(produtora.status_code)
    response.json(produtora)
})

router.post('/', bodyParserJSON, async function (request, response) {
    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let produtora = await controllerProdutora.inserirProdutora(dadosBody, contentType)

    response.status(produtora.status_code)
    response.json(produtora)
})

router.put('/:id', bodyParserJSON, async function (request, response) {
    // Recebe os dados do body
    let dadosBody = request.body

    // Recebe o id do filme encaminhado pelo URL
    let idProdutora = request.params.id

    // Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    let produtora = await controllerProdutora.atualizarProdutora(dadosBody, idProdutora, contentType)

    response.status(produtora.status_code)
    response.json(produtora)
})

router.delete('/:id', async function (request, response) {
    let idProdutora = request.params.id

    let personagem = await controllerProdutora.excluirProdutora(idProdutora)

    response.status(personagem.status_code)
    response.json(personagem)
})

module.exports = router
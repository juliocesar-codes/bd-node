// --------------------- EndPoints para CRUD de Filmes ----------------------- 


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

const controllerFilme = require('../controller/filme/controller_filme.js')

// Request -> Recebe os Dados da Requisição
// Response -> Envia os Dados na API

// Retorna a lista de Filmes
router.get('/', async function(request,response){
    // Chama a função da controller para retornar todos os filmes
    let filme = await controllerFilme.listarFilmes()

    response.status(filme.status_code)
    response.json(filme)
})

// Retorna um Filme filtrando pelo id
router.get('/:id', async function(request,response){

    // Recebe o id enviado na requisição via parametro
    let idFilme = request.params.id

    // Chama a função da controller para retornar todos os filmes
    let filme = await controllerFilme.buscarFilmeId(idFilme)

    console.log(filme)

    response.status(filme.status_code)
    response.json(filme)
})

// Insere um novo filme no banco de dados
router.post('/', bodyParserJSON, async function(request, response){
    // Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    // Recebe o content type da requisição
    let contentType = request.headers['content-type']

    // Chama a função da controller para inserir o filme, enviamos os dados do body e o content-type
    let filme = await controllerFilme.inserirFilme(dadosBody, contentType)

    response.status(filme.status_code)
    response.json(filme)
})

router.put('/:id', bodyParserJSON, async function (request, response) {
    // Recebe os dados do body
    let dadosBody = request.body

    // Recebe o id do filme encaminhado pelo URL
    let idFilme = request.params.id

    // Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    let filme = await controllerFilme.atualizarFilme(dadosBody, idFilme, contentType)

    response.status(filme.status_code)
    response.json(filme)


})

router.delete('/:id', async function (request, response) {
    let idFilme = request.params.id

    let filme = await controllerFilme.excluirFilme(idFilme)

    response.status(filme.status_code)
    response.json(filme)

})

module.exports = router
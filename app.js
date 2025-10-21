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
const PORT = process.PORT || 8080

// Instancia na classe do express
const app = express()

app.use((request, response, next) =>{
    response.header('Access-Control-Allow-Origin', '*') // IP de Origem
    response.header('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS') // Métodos (Verbos) do protocolo HTTP

    app.use(cors())
    next() // Próximo
})

// Import das controllers da API
const controllerFilme = require('./controller/filme/controller_filme.js')
const controllerGenero = require('./controller/genero/controller_generos.js')

// Request -> Recebe os Dados da Requisição
// Response -> Envia os Dados na API

// EndPoints para CRUD de Filmes

// Retorna a lista de Filmes
app.get('/v1/locadora/filme', cors(), async function(request,response){
    // Chama a função da controller para retornar todos os filmes
    let filme = await controllerFilme.listarFilmes()

    response.status(filme.status_code)
    response.json(filme)
})

// Retorna um Filme filtrando pelo id
app.get('/v1/locadora/filme/:id', cors(), async function(request,response){

    // Recebe o id enviado na requisição via parametro
    let idFilme = request.params.id

    // Chama a função da controller para retornar todos os filmes
    let filme = await controllerFilme.buscarFilmeId(idFilme)

    response.status(filme.status_code)
    response.json(filme)
})

// Insere um novo filme no banco de dados
app.post('/v1/locadora/filme', cors(), bodyParserJSON, async function(request, response){
    // Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    // Recebe o content type da requisição
    let contentType = request.headers['content-type']

    // Chama a função da controller para inserir o filme, enviamos os dados do body e o content-type
    let filme = await controllerFilme.inserirFilme(dadosBody, contentType)

    response.status(filme.status_code)
    response.json(filme)
})

app.put('/v1/locadora/filme/:id', cors(), bodyParserJSON, async function (request, response) {
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

app.delete('/v1/locadora/filme/:id', cors(), async function (request, response) {
    let idFilme = request.params.id

    let filme = await controllerFilme.excluirFilme(idFilme)

    response.status(filme.status_code)
    response.json(filme)

})

// End Point que retorna todos os generos
app.get('/v1/locadora/genero', cors(), async function (request, response) {
    // Chama a função da controller para retornar todos os filmes
    let genero = await controllerGenero.listarGeneros()

    response.status(genero.status_code)
    response.json(genero)
})

// End Point que retorna um genero pelo id Inserido
app.get('/v1/locadora/genero/:id', cors(), async function (request, response) {
    // Recebe o id enviado na requisição via parametro
    let idGenero = request.params.id

    // Chama a função da controller para retornar todos os filmes
    let genero = await controllerGenero.buscarGeneroId(idGenero)

    response.status(genero.status_code)
    response.json(genero)
})

// Insere um novo genero no banco de dados
app.post('/v1/locadora/genero', cors(), bodyParserJSON, async function(request, response){
    // Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    // Recebe o content type da requisição
    let contentType = request.headers['content-type']

    // Chama a função da controller para inserir o filme, enviamos os dados do body e o content-type
    let genero = await controllerGenero.inserirGenero(dadosBody, contentType)

    response.status(genero.status_code)
    response.json(genero)
})


app.listen(PORT, function(){
    console.log('API aguardando requisições...')
})



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
// const bodyParser = require('body-parser')

// Cria um objeto especialista no formato JSON para receber os dados do body (POST E PUT)
// const bodyParserJSON = bodyParser.json()


// Definir porta padrão 
const PORT = process.env.PORT || 8080

// Instancia na classe do express
const app = express()

app.use((request, response, next) =>{
    response.header('Access-Control-Allow-Origin', '*') // IP de Origem
    response.header('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS') // Métodos (Verbos) do protocolo HTTP

    app.use(cors())
    next() // Próximo
})

// // --------------------- EndPoints para CRUD de Personagens ----------------------- 

// app.get('/v1/locadora/personagem', cors(), async function (request, response) {
//     let personagem = await controllerPersonagem.listarPersonagens()

//     response.status(personagem.status_code)
//     response.json(personagem)
// })

// app.get('/v1/locadora/personagem/:id', cors(), async function (request, response) {
//     let idPersonagem = request.params.id

//     let personagem = await controllerPersonagem.listarPersonagensById(idPersonagem)

//     response.status(personagem.status_code)
//     response.json(personagem)
// })

// app.post('/v1/locadora/personagem', cors(), bodyParserJSON, async function (request, response) {
//     let dadosBody = request.body

//     let contentType = request.headers['content-type']

//     let personagem = await controllerPersonagem.inserirPersonagem(dadosBody, contentType)

//     response.status(personagem.status_code)
//     response.json(personagem)
// })

// app.put('/v1/locadora/personagem/:id', cors(), bodyParserJSON, async function (request, response) {
//     // Recebe os dados do body
//     let dadosBody = request.body

//     // Recebe o id do filme encaminhado pelo URL
//     let idPersonagem = request.params.id

//     // Recebe o content-type da requisição
//     let contentType = request.headers['content-type']

//     let personagem = await controllerPersonagem.atualizarPersonagem(dadosBody, idPersonagem, contentType)

//     response.status(personagem.status_code)
//     response.json(personagem)
// })

// app.delete('/v1/locadora/personagem/:id', cors(), async function (request, response) {
//     let idPersonagem = request.params.id

//     let personagem = await controllerPersonagem.deletarPersonagem(idPersonagem)

//     response.status(personagem.status_code)
//     response.json(personagem)
// })

// // --------------------- EndPoints para CRUD de Produtoras ----------------------- 

// app.get('/v1/locadora/produtora', cors(), async function (request, response) {
//     let produtora = await controllerProdutora.listarProdutoras()

//     response.status(produtora.status_code)
//     response.json(produtora)
// })

// app.get('/v1/locadora/produtora/:id', cors(), async function (request, response) {
//     let idProdutora = request.params.id

//     let produtora = await controllerProdutora.buscarProdutoraId(idProdutora)

//     response.status(produtora.status_code)
//     response.json(produtora)
// })

// app.post('/v1/locadora/produtora', cors(), bodyParserJSON, async function (request, response) {
//     let dadosBody = request.body

//     let contentType = request.headers['content-type']

//     let produtora = await controllerProdutora.inserirProdutora(dadosBody, contentType)

//     response.status(produtora.status_code)
//     response.json(produtora)
// })

// app.put('/v1/locadora/produtora/:id', cors(), bodyParserJSON, async function (request, response) {
//     // Recebe os dados do body
//     let dadosBody = request.body

//     // Recebe o id do filme encaminhado pelo URL
//     let idProdutora = request.params.id

//     // Recebe o content-type da requisição
//     let contentType = request.headers['content-type']

//     let produtora = await controllerProdutora.atualizarProdutora(dadosBody, idProdutora, contentType)

//     response.status(produtora.status_code)
//     response.json(produtora)
// })

// app.delete('/v1/locadora/produtora/:id', cors(), async function (request, response) {
//     let idProdutora = request.params.id

//     let personagem = await controllerProdutora.excluirProdutora(idProdutora)

//     response.status(personagem.status_code)
//     response.json(personagem)
// })

const routesAtor = require('./routes/route.ator.js')
app.use('/v1/locadora/ator',   cors(),    routesAtor)

const routesFilme = require('./routes/route.filme.js')
app.use('/v1/locadora/filme',   cors(),    routesFilme)

const routesGenero = require('./routes/route.genero.js')
app.use('/v1/locadora/genero', cors(), routesGenero)


app.listen(PORT, function(){
    console.log('API aguardando requisições...')
})



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


app.listen(PORT, function(){
    console.log('API aguardando requisições...')
})


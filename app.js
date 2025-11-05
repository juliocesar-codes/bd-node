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



const routesAtor = require('./routes/route_ator.js')
app.use('/v1/locadora/ator',   cors(),    routesAtor)

const routesFilme = require('./routes/route_filme.js')
app.use('/v1/locadora/filme',   cors(),    routesFilme)

const routesGenero = require('./routes/route_genero.js')
app.use('/v1/locadora/genero', cors(), routesGenero)

const routesProdutora = require('./routes/route_produtora.js')
app.use('/v1/locadora/produtora', cors(), routesProdutora)

const routesPersonagem = require('./routes/route_personagem.js')
app.use('/v1/locadora/personagem', cors(), routesPersonagem)

app.listen(PORT, function(){
    console.log('API aguardando requisições...')
})



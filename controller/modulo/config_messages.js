/**************************************************************************************************
 * Objetivo: Arquivo responsável pela padronização de todas mensagens da API do projeto de Filmes
 * Data: 07/10/2025
 * Autor: Julio Cesar
 * Versão: 1.0
 **************************************************************************************************/

const data_atual = new Date()

/*************************************** MENSAGENS DE PADRONIZAÇÃO DO PROJETO ************************************ */
const MESSAGE_HEADER = {
    development: 'Julio Cesar Santana Alves',
    api_description: 'API para manipular dados da locadora de filmes',
    version: '1.0.10.25',
    request_date: data_atual.toLocaleDateString(),
    status: Boolean,
    status_code: Number,
    response: {}
}


/************************************** MENSAGENS DE ERRO DO PROJETO ********************************************* */



/************************************** MENSAGENS DE SUCESSO DO PROJETO ******************************************* */
const MESSAGE_SUCESS_REQUEST = {status: true, status_code:200, message:'Requisição bem sucedida'}



module.exports={
    MESSAGE_HEADER,
    MESSAGE_SUCESS_REQUEST
}

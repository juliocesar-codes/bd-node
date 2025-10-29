/********************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de filme no Banco de Dados MySQL
 * Data: 01/10/2025
 * Autor: Julio Cesar
 * Versão: 1.0
 *******************************************************************************************/


// Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')
const { setUpdateGenrs } = require('./genero')

// Cria um objeto do PrismaClient para manipular os scripts SQL
const prisma = new PrismaClient()

const getSelectAllPersona = async function () {

    try {
        // Script SQL
    let sql = `SELECT * FROM tbl_personagem order by id desc`

    // Executa no banco de dados o script
    let result = await prisma.$queryRawUnsafe(sql)

    if (Array.isArray(result))
        return result
    else
        return false
    } catch (error) {
        return false
    }
    
}

const getSelectAllPersonaById = async function (id) {
    try {
        let sql = `SELECT * FROM tbl_personagem WHERE id = ${id}`

        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

const getSelectLastIdFilm = async function () {
    try {
        // Script SQL 
        let sql = `select id from tbl_personagem order by id desc limit 1`

        // Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        // Validação para identificar se o retorno do banco é um array (vazio ou com dados)
        if (Array.isArray(result))
            return Number(result[0].id)
        else
            return false

    } catch (error) {
        // console.log(error)
        return false
    }
}

const setInsertPersona = async function (personagem) {
    try {
        let sql = `INSERT INTO tbl_personagem (nome, apelido, historia, ocupacao, especie, imagem, idade)VALUES('${personagem.nome}','${personagem.apelido}','${personagem.historia}','${personagem.ocupacao}','${personagem.especie}','${personagem.imagem}',${personagem.idade});`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            return true
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

const setUpdatePersona = async function (personagem) {
    try {
        let sql = `UPDATE tbl_personagem SET 
        nome = '${personagem.nome}',
        apelido = '${personagem.apelido}',
        historia = '${personagem.historia}', 
        ocupacao = '${personagem.ocupacao}', 
        especie = '${personagem.especie}', 
        imagem = '${personagem.imagem}', 
        idade = '${personagem.idade}' WHERE ID = ${personagem.id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        }else
            return false
    } catch (error) {
        return false
    }
}

const setDeletePersona = async function (id) {
    try {
        let sql = `DELETE FROM tbl_personagem WHERE id = ${id}`

        let result = await prisma.$executeRawUnsafe(sql)
        if (result) {
            return true
        }else 
            return false
    } catch (error) {
        return false
    }
}

module.exports = {
    getSelectAllPersona,
    getSelectAllPersonaById,
    getSelectLastIdFilm,
    setInsertPersona,
    setUpdatePersona,
    setDeletePersona
}
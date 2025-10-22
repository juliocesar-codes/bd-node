/********************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de filme no Banco de Dados MySQL
 * Data: 01/10/2025
 * Autor: Julio Cesar
 * Versão: 1.0
 *******************************************************************************************/

// Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

// Cria um objeto do PrismaClient para manipular os scripts SQL
const prisma = new PrismaClient()

// Retorna todos os filmes do banco de dados
const getSelectAllGenrs = async function () {

    try {
        // Script SQL 
        let sql = `select * from tbl_genero order by id desc`

        // Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        // Validação para identificar se o retorno do banco é um array (vazio ou com dados)
        if (Array.isArray(result))
            return result
        else
            return false

    } catch (error) {
        // console.log(error)
        return false
    }

}

// Retorna um filme filtrando pelo ID do banco de dados
const getSelectByIdGenrs = async function (id) {
    try {
        // Script SQL 
        let sql = `select * from tbl_genero where id = ${id}`

        // Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        // Validação para identificar se o retorno do banco é um array (vazio ou com dados)
        if (Array.isArray(result))
            return result
        else
            return false

    } catch (error) {
        // console.log(error)
        return false
    }
}

const getSelectLastIdFilm = async function () {
    try {
        // Script SQL 
        let sql = `select id from tbl_genero order by id desc limit 1`

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

const setInsertGenrs = async function (genero) {
    try {
        // Script SQL
        let sql = `INSERT INTO tbl_genero (nome) VALUES ('${genero.nome}');`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const setUpdateGenrs = async function (genero) {
    try {
        let sql = `UPDATE tbl_genero SET nome = '${genero.nome}' WHERE id = ${genero.id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        }
        else 
        return false
    } catch (error) {
        return false
    }
}

const setDeleteGenrs = async function (id) {
    try {
        let sql = `DELETE FROM tbl_genero WHERE id = ${id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        }else 
            return false
    } catch (error) {
        return false
    }
}

module.exports={
    getSelectAllGenrs,
    getSelectByIdGenrs,
    getSelectLastIdFilm,
    setInsertGenrs,
    setUpdateGenrs,
    setDeleteGenrs
}
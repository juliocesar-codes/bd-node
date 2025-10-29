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

const getSelectAllProducer = async function () {
    try {
        let sql = `SELECT * FROM tbl_produtora order by id desc`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

const getSelectByIdProducer = async function (id) {
    try {
        let sql = `SELECT * FROM tbl_produtora WHERE id = ${id}`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

const getSelectLastIdProducer = async function () {
    try {
        let sql = `select id from tbl_produtora order by id desc limit 1`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return Number(result[0].id)
        else
        console.log(result)
            return false
    } catch (error) {
        return false
    }
}

const setInsertProducer = async function (produtora) {
    try {
        let sql = `INSERT INTO tbl_produtora(nome, fundador, data_fundacao, presidente, sede)
VALUES('${produtora.nome}', '${produtora.fundador}', '${produtora.data_fundacao}', '${produtora.presidente}', '${produtora.sede}');`

        // $$executeRawUnsafe permite apenas executar scripts sql e não retorno de dados (INSERT, UPDATE e DELETE)
        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const setUpdateProducer = async function (produtora) {
    try {
        let sql = `UPDATE tbl_produtora SET
        nome = '${produtora.nome}',
        fundador = '${produtora.fundador}', 
        data_fundacao = '${produtora.data_fundacao}',
        presidente = '${produtora.presidente}',
        sede = '${produtora.sede}'
        where id = ${produtora.id}`

        // $$executeRawUnsafe permite apenas executar scripts sql e não retorno de dados (INSERT, UPDATE e DELETE)
        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    getSelectAllProducer,
    getSelectByIdProducer,
    getSelectLastIdProducer,
    setInsertProducer,
    setUpdateProducer
}
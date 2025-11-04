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

const getSelectAllActor = async function () {

    try {
        // Script SQL
    let sql = `SELECT * FROM tbl_ator order by id desc`

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

const getSelectAllActorById = async function (id) {
    try {
        let sql = `SELECT * FROM tbl_ator WHERE id = ${id}`

        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

const getSelectLastIdActor = async function () {
    try {
        // Script SQL 
        let sql = `select id from tbl_ator order by id desc limit 1`

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

const setInsertActor = async function (ator) {
    try {
        let sql = `INSERT INTO tbl_ator (nome, data_nascimento, nacionalidade, genero, email, telefone, endereco, altura, peso) 
        VALUES(
        '${ator.nome}',
        '${ator.data_nascimento}',
        '${ator.nacionalidade}',
        '${ator.genero}',
        '${ator.email}',
        '${ator.telefone}',
        '${ator.endereco}',
        '${ator.altura}',
        '${ator.peso}');`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            return true
        }else{
            return false

        }
    } catch (error) {
        console.log(error)
        return false
    }
}

const setUpdateActors = async function (ator) {
    try {
        let sql = `UPDATE tbl_ator SET 
        nome = '${ator.nome}',
        data_nascimento = '${ator.data_nascimento}',
        nacionalidade = '${ator.nacionalidade}',
        genero = '${ator.genero}',
        email = '${ator.email}',
        telefone = '${ator.telefone}',
        endereco = '${ator.endereco}',
        altura = '${ator.altura}',
        peso = '${ator.peso}'  
        where id = ${ator.id}`

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



const setDeleteActor = async function (id) {
    try {
        let sql = `DELETE FROM tbl_ator WHERE id = ${id}`

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
    getSelectAllActor,
    getSelectAllActorById,
    getSelectLastIdActor,
    setInsertActor,
    setUpdateActors,
    setDeleteActor
}
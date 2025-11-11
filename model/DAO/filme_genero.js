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

// Retorna todos os filmes e generos do banco de dados
const getSelectAllFilmsGenres = async function () {

    try {
        // Script SQL 
        let sql = `select * from tbl_filme_genero order by id desc`

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
const getSelectByIdFilmGenrs = async function (id) {
    try {
        // Script SQL 
        let sql = `select * from tbl_filme_genero where id = ${id}`

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

// Retorna os generos filtrando pelo ID do filme
const getSelectGenresByIdFilms = async function (idFilme) {
    try {
        // Script SQL 
        let sql = `select tbl_genero.id, tbl_genero.nome 
                   from tbl_filmes inner join tbl_filme_genero
                   on tbl_filmes.id = tbl_filme_genero.id_filme
                   inner join tbl_genero on tbl_genero.id = tbl_filme_genero.id_genero
                   where tbl_filmes.id = ${idFilme}`

        // Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        // Validação para identificar se o retorno do banco é um array (vazio ou com dados)
        if (Array.isArray(result))
            return result
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}

const getSelectFilmsByIdGenres = async function (idGenero) {
    try {
        // Script SQL 
        let sql = `select tbl_filme.id, tbl_filme.nome 
                   from tbl_filme inner join tbl_filme_genero
                   on tbl_filme.id = tbl_filme_genero.id_filme
                   inner join tbl_genero on tbl_genero.id = tbl_filme_genero.id_genero
                   where tbl_genero.id = ${idGenero}`

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

const getSelectLastId = async function () {
    try {
        // Script SQL 
        let sql = `select id from tbl_filme_genero order by id desc limit 1`

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

const setInsertFilmsGenres = async function (filmeGenero) {
    try {
        // Script SQL
        let sql = `INSERT INTO tbl_filme_genero (id_filme, id_genero) VALUES (${filmeGenero.id_filme}, ${filmeGenero.id_genero});`

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

const setUpdateFilmsGenres = async function (filmeGenero) {
    try {
        let sql = `UPDATE tbl_filme_genero SET id_filme = ${filmeGenero.id_filme}, id_genero = ${filmeGenero.id_genero} WHERE id = ${filmeGenero.id}`

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

const setDeleteFilmsGenres = async function (id) {
    try {
        let sql = `DELETE FROM tbl_filme_genero WHERE id = ${id}`

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
    getSelectAllFilmsGenres,
    getSelectByIdFilmGenrs,
    getSelectGenresByIdFilms,
    getSelectFilmsByIdGenres,
    getSelectLastId,
    setInsertFilmsGenres,
    setUpdateFilmsGenres,
    setDeleteFilmsGenres
}
const mysql = require('promise-mysql');
const fs = require('fs')
const sqlConnectionConfig = require('../local_config')

class SqlTestUtils {
    constructor(expect, tableName, filename) {
        this.connection = null
        this.expect = expect
        this.tableName = tableName
        this.filename = filename
        this.SELECT_ALL_FROM = "SELECT * FROM"
        this.DROP_TABLE = "DROP TABLE"
        this.STRING = "string"
    }

    getFilePath() {
        return `./${this.filename}.sql`
    }

    async createSQLConnection() {
        this.connection = await mysql.createConnection(sqlConnectionConfig)
    }

    async tableSetup(commands) {
        for (let command of commands) {
            await this.connection.query(command)
        }
    }

    async dropAndEndConnection() {
        await this.connection.query(`${this.DROP_TABLE} ${this.tableName}`)
        await this.connection.end()
    }

    async getQueryResult(isSelect, query, shouldBeEmpty = false) {
        const badSyntaxResult = { result: null, message: "Error running your query, please check the syntax" }

        if (!isSelect) {
            try { await this.connection.query(query) }
            catch (error) { return badSyntaxResult }

            query = `${this.SELECT_ALL_FROM} ${this.tableName}`
        }

        let result
        try { result = await this.connection.query(query) }
        catch (error) { return badSyntaxResult }

        return (!shouldBeEmpty && result.length === 0) ?
            { result: null, message: "Result from query is empty" } :
            { result }
    }

    isExactTablename(query) {
        let startIndex = query.indexOf(this.tableName)
        let studentTableName = query.substring(startIndex, startIndex + this.tableName.length + 1).replace(/\W/g, '')
        return studentTableName === this.tableName
    }

    async getStudentQuery(expect) {
        const result = { error: false, errorMessage: "", query: "" }
        try {
            const query = fs.readFileSync(this.getFilePath(), 'utf8')
            const lines = query.split("\n")

            if (lines[0].toLowerCase().includes("use")) {
                result.error = true
                result.errorMessage = "Should not have 'use' in submission file; only submit the requested query"
            }
            else if (!query.includes(this.tableName) || !this.isExactTablename(query)) {
                result.error = true
                result.errorMessage = `Wrong table name. Should be ${this.tableName}`
            }
            else { result.query = query }

        } catch (err) {
            result.error = true
            result.errorMessage = `Bad file submission. 
            Make sure you've uploaded a file called ${this.filename}.sql \n${err}`
        }

        if (result.error) {
            await this.dropAndEndConnection()
            return expect(result.error, result.errorMessage).toBeFalsy()
        }

        return result.query
    }
}

module.exports = SqlTestUtils
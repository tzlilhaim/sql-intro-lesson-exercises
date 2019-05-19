const mysql = require('promise-mysql');
const fs = require('fs')
const sqlConnectionConfig = {
    host: 'localhost',
    user: 'root',
    database: 'sql_testing',
    insecureAuth: true
}

class SqlTestUtils {
    constructor(tableName, filename) {
        this.connection = null
        this.tableName = tableName
        this.filename = filename
        this.SELECT_ALL_FROM = "SELECT * FROM"
        this.DROP_TABLE = "DROP TABLE"
        this.STRING = "string"
    }

    getFilePath() {
        return `./solutions/${this.filename}.sql`
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
        const extraErrorForInsert = isSelect ? "" : " and make sure you're using all the necessary columns"
        const badSyntaxResult = { result: null, message: "Error running your query, please check the syntax" + extraErrorForInsert }

        if (!isSelect) {
            try { await this.connection.query(query) }
            catch (error) { console.log(error); return badSyntaxResult }

            query = `${this.SELECT_ALL_FROM} ${this.tableName}`
        }

        let result
        try { result = await this.connection.query(query) }
        catch (error) { console.log(error); return badSyntaxResult }

        return (!shouldBeEmpty && result.length === 0) ?
            { result: null, message: "Result from query is empty" } :
            { result }
    }

    isExactTablename(query) {
        let startIndex = query.toLowerCase().indexOf(this.tableName.toLowerCase())
        let studentTableName = query.toLowerCase().substring(startIndex, startIndex + this.tableName.length + 1).replace(/\W/g, '')
        return studentTableName.toLowerCase() === this.tableName.toLowerCase()
    }

    _error = message => { return { error: true, errorMessage: message } }

    _loadFile() {
        try {
            return fs.readFileSync(this.getFilePath(), 'utf8')
        } catch (err) { return null }
    }

    getCleanQuery(lines) {
        //remove any 'use' and comment lines
        let linesSansCommentsOrUse = lines.filter(l => l[0] !== "-" && !l.toLowerCase().includes("use"))
        
        for (let l in linesSansCommentsOrUse) {
            let line = linesSansCommentsOrUse[l]
            let indexOfDash = line.indexOf("--") //remove inline-comments
            
            if (indexOfDash > -1) {
                linesSansCommentsOrUse[l] = line.replace(line.substring(indexOfDash), "")
            }
        }
        return linesSansCommentsOrUse.join("\n")
    }

    async getStudentQuery() {
        let query = this._loadFile()
        if (query === null) { return this._error(`Bad file submission. Make sure you've uploaded a file called ${this.filename}.sql in your root directory`) }
        
        const lines = query.split("\n")
        if (lines.length < 1 || lines.every(l => l.length === 0)) {
            return this._error(`Seems you've submitted an empty file. Make sure your query is in ${this.filename}.sql`)
        }
        if (!lines[0].length) {
            return this._error(`Your query should start at the beginning of the file (${this.filename}.sql) - don't leave an empty line`)
        }
        if (!query.toLowerCase().includes(this.tableName.toLowerCase()) || !this.isExactTablename(query)) {
            return this._error(`Wrong table name. Should be exactly ${this.tableName}`)
        }

        query = this.getCleanQuery(lines)
        
        return { error: false, query }
    }
}

module.exports = SqlTestUtils
const SqlTestUtils = require('../sql_test_utils')

describe("exercise1", () => {
    jest.setTimeout(10000) //HACK solution to let test run more than 5s default. Not sure of what we could do otherwise; it's a remote server.

    it('Should query for deities that have "eh" somewhere in their name', async (done) => {
        const testUtils = new SqlTestUtils(expect, "Deity", "check_4")
        const isSelect = true

        await testUtils.createSQLConnection()
        await testUtils.tableSetup([`
        CREATE TABLE Deity(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50),
        mythology VARCHAR(20),
        main_power VARCHAR(50),
        coolness INT,
        creation_date INT
        )`,
        `INSERT INTO Deity
        VALUES(null, "breht", "myth", "dp", 0, 0);`,
        `INSERT INTO Deity
        VALUES(null, "ehmet", "myth", "dp", 0, 0);`,
        `INSERT INTO Deity
        VALUES(null, "carl", "derp", "dp", 0, 0);`
        ])

        const studentQuery = await testUtils.getStudentQuery(expect)
        let result = await testUtils.getQueryResult(isSelect, studentQuery, expect, done)
        
        await testUtils.safeExpect( result.length, 2, "Should return only rows where 'eh' appears somewhere in the name")
        
        for(let expectedName of ["breht", "ehmet"]){
            await testUtils.safeExpect(result.some(r => r.name === expectedName), true, "Should return the rows where the names have an 'eh' somewhere in them")
        }

        await testUtils.dropAndEndConnection()
        done() //for async
    });
})

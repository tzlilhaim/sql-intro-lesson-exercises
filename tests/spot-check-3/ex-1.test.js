const SqlTestUtils = require('../sql_test_utils')

describe("exercise1", () => {
    jest.setTimeout(10000) //HACK solution to let test run more than 5s default. Not sure of what we could do otherwise; it's a remote server.

    it('Should query for the deities who are both from Greek mythology AND with a coolness level greater than 8', async (done) => {
        const testUtils = new SqlTestUtils(expect, "Deity", "check_3")
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
        VALUES(null, "d1", "greek", "dp", 8, 0);`,
        `INSERT INTO Deity
        VALUES(null, "d2", "greek", "dp", 9, 0);`,
        `INSERT INTO Deity
        VALUES(null, "d3", "roman", "dp", 9, 0);`
        ])

        const studentQuery = await testUtils.getStudentQuery(expect)
        let result = await testUtils.getQueryResult(isSelect, studentQuery, expect, done)
        
        await testUtils.safeExpect(result.length, 1, "Should return only rows where the mythology is greek, and coolness level is greater than 8.")
        await testUtils.safeExpect(result[0].name, "d2")

        await testUtils.dropAndEndConnection()
        done() //for async
    });
})

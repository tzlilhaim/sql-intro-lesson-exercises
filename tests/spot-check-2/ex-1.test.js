const SqlTestUtils = require('../sql_test_utils')

describe("exercise1", () => {
    jest.setTimeout(10000) //HACK solution to let test run more than 5s default. Not sure of what we could do otherwise; it's a remote server.

    it('Should select only the coolness level and names of your deities, instead of using an *', async (done) => {
        const testUtils = new SqlTestUtils("Deity", "check_2")
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
        VALUES(null, "test-name", "test-myth", "test-power", 42, 24);`
        ])

        const studentQuery = await testUtils.getStudentQuery(expect)
        let result = await testUtils.getQueryResult(isSelect, studentQuery, expect, done)

        await testUtils.safeExpect(expect, result[0].name, "test-name")
        await testUtils.safeExpect(expect, result[0].coolness, 42)

        await testUtils.safeExpect(expect, result[0].mythology, undefined, "Should only return coolness and name columns. This query also returned mythology")
        await testUtils.safeExpect(expect, result[0].main_power, undefined, "Should only return coolness and name columns. This query also returned main_power")
        await testUtils.safeExpect(expect, result[0].creation_date, undefined, "Should only return coolness and name columns. This query also returned creation_date")

        await testUtils.dropAndEndConnection()
        done() //for async
    });
})

const SqlTestUtils = require('../sql_test_utils')

describe("exercise1", () => {
    it('Should query for deities name, coolness, and creation date. Order the results first by creation date, then by decreasing coolness.', async (done) => {
        const testUtils = new SqlTestUtils(expect, jest, "Deity", "check_5")
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
            `INSERT INTO Deity VALUES(null, "Felurian", "derp", "dp", null , 0);`,
            `INSERT INTO Deity VALUES(null, "Hephaestus", "derp", "dp", 4, '-1400');`,
            `INSERT INTO Deity VALUES(null, "Hera", "derp", "dp", 9, '-1200');`,
            `INSERT INTO Deity VALUES(null, "Athena", "myth", "dp", 10, '-1600');`,
            `INSERT INTO Deity VALUES(null, "Zeus", "derp", "dp", 11, '-1400');`,
            `INSERT INTO Deity VALUES(null, "Mehit", "myth", "dp", 7, '-3000');`
        ])

        const studentQuery = await testUtils.getStudentQuery(expect)
        let result = await testUtils.getQueryResult(isSelect, studentQuery, expect, done)
        let expectedOrder = ["Mehit", "Athena", "Zeus", "Hephaestus", "Hera", "Felurian"]

        await testUtils.safeExpect(result.length, 6, `Should return all deities in the correct order.`)

        for (let i in result) {
            await testUtils.safeExpect(result[i].name, expectedOrder[i], "Order of deities incorrect. Remember to order first by creation_date, then by DESCending coolness")
        }

        await testUtils.dropAndEndConnection()
        done() //for async
    });
})

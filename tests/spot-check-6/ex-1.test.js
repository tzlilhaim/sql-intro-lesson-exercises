const SqlTestUtils = require('../sql_test_utils')

describe("exercise1", () => {
    jest.setTimeout(10000) //HACK solution to let test run more than 5s default. Not sure of what we could do otherwise; it's a remote server.

    it('Should update every deity whose coolness level is above 10 to have a coolness level of 10', async (done) => {
        const testUtils = new SqlTestUtils(expect, "Deity", "check_6")
        const isSelect = false

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
            `INSERT INTO Deity VALUES(null, "name1", "myth", "dp", 8, 0);`,
            `INSERT INTO Deity VALUES(null, "name2", "myth", "dp", 9, 0);`,
            `INSERT INTO Deity VALUES(null, "name3", "myth", "dp", 10, 0);`,
            `INSERT INTO Deity VALUES(null, "name4", "myth", "dp", 11, 0);`,
            `INSERT INTO Deity VALUES(null, "name5", "myth", "dp", 12, 0);`
        ])

        const studentQuery = await testUtils.getStudentQuery(expect)
        let result = await testUtils.getQueryResult(isSelect, studentQuery, expect, done)

        let expectedLevels = [8, 9, 10]

        for (let r of result) {
            await testUtils.safeExpect(expectedLevels.includes(r.coolness) && r.coolness <= 10, true, "Only a deity whose coolness is above 10 should have their coolness changed to 10. Everyone else should stay the same.")
        }

        await testUtils.dropAndEndConnection()
        done() //for async
    });
})

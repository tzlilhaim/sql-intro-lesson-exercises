const SqlTestUtils = require('../sql_test_utils')

describe("exercise1", () => {
    jest.setTimeout(10000) //HACK solution to let test run more than 5s default. Not sure of what we could do otherwise; it's a remote server.
    
    it('Should remove any deity whose main power starts with the letter "w"', async (done) => {
        const testUtils = new SqlTestUtils("Deity", "check_7")
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
            `INSERT INTO Deity VALUES(null, "name1", "myth", "fire", 0, 0);`,
            `INSERT INTO Deity VALUES(null, "name2", "myth", "water", 0, 0);`,
            `INSERT INTO Deity VALUES(null, "name3","myth",  "dow", 0, 0);`,
            `INSERT INTO Deity VALUES(null, "name4", "myth", "wind", 0, 0);`,
            `INSERT INTO Deity VALUES(null, "name5", "myth", "howl", 0, 0);`
        ])

        const studentQuery = await testUtils.getStudentQuery(expect)
        let result = await testUtils.getQueryResult(isSelect, studentQuery, expect, done)

        await testUtils.safeExpect(expect, result.length, 3, "Should only remove deities whose main_power *starts* with 'w' - it's ok to have a 'w' elsewhere in the power")

        for (let r of result) {
            await testUtils.safeExpect(expect, r.main_power[0] === "w", false, "Found a deity whose main_power begins with 'w'")
        }

        await testUtils.dropAndEndConnection()
        done() //for async
    });
})

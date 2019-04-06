const SqlTestUtils = require('../sql_test_utils')

describe("exercise1", () => {
    it('Should delete all dolphins that have a height less than 2 and are blue', async (done) => {
        const testUtils = new SqlTestUtils(expect, jest, "Dolphin", "ex_3")
        const isSelect = false

        await testUtils.createSQLConnection()
        await testUtils.tableSetup([`
        CREATE TABLE Dolphin(
            name VARCHAR(20) NOT NULL PRIMARY KEY,
            color VARCHAR(20),
            height INT,
            healthy BOOLEAN DEFAULT TRUE
        )`,
            `INSERT INTO Dolphin VALUES("d1", "blue", 2, DEFAULT);`,
            `INSERT INTO Dolphin VALUES("d2", "blue", 1, DEFAULT);`,
            `INSERT INTO Dolphin VALUES("d3", "green", 1, DEFAULT);`,
            `INSERT INTO Dolphin VALUES("d4", "blue", 0, DEFAULT);`,
            `INSERT INTO Dolphin VALUES("d5", "green", 2, DEFAULT);`,
        ])

        const studentQuery = await testUtils.getStudentQuery(expect)
        let result = await testUtils.getQueryResult(isSelect, studentQuery, expect, done)

        await testUtils.safeExpect(result.length, 3, "Unexpected number of dolphins found! Only delete those that are blue AND have a height *less than* 2.")

        for (let r of result) {
            await testUtils.safeExpect(r.name.height >= 2 && r.color != "blue", false, "Found a short blue dolphin. Get rid of it!")
        }

        await testUtils.dropAndEndConnection()
        done() //for async
    });
})

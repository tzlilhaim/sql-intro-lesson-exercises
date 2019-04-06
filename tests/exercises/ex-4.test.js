const SqlTestUtils = require('../sql_test_utils')

describe("exercise1", () => {
    it('Should update Daron to have a height of 6', async (done) => {
        const testUtils = new SqlTestUtils(expect, jest, "Dolphin", "ex_4")
        const isSelect = false

        await testUtils.createSQLConnection()
        await testUtils.tableSetup([`
        CREATE TABLE Dolphin(
            name VARCHAR(20) NOT NULL PRIMARY KEY,
            color VARCHAR(20),
            height INT,
            healthy BOOLEAN DEFAULT TRUE
        )`,
            `INSERT INTO Dolphin VALUES("carl", "c", 2, DEFAULT);`,
            `INSERT INTO Dolphin VALUES("daron", "blue", 9, DEFAULT);`
        ])

        const studentQuery = await testUtils.getStudentQuery(expect)
        let result = await testUtils.getQueryResult(isSelect, studentQuery, expect, done)

        let daron = result.find(d => d.name === "daron")
        let carl = result.find(d => d.name === "carl")

        await testUtils.safeExpect(daron.height, 6, "Should change the dolphin who has a name of 'Daron' so that he has a height of 6")
        await testUtils.safeExpect(carl.height, 2, "Should not change any other dolphin's height")

        await testUtils.dropAndEndConnection()
        done() //for async
    });
})

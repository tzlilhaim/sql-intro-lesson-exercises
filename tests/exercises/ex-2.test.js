const SqlTestUtils = require('../sql_test_utils')

describe("exercise1", () => {
    it('Should find all that have "on" anywhere in their name', async (done) => {
        const testUtils = new SqlTestUtils(expect, jest, "Dolphin", "ex_2")
        const isSelect = true

        await testUtils.createSQLConnection()
        await testUtils.tableSetup([`
        CREATE TABLE Dolphin(
            name VARCHAR(20) NOT NULL PRIMARY KEY,
            color VARCHAR(20),
            height INT,
            healthy BOOLEAN DEFAULT TRUE
        )`,
            `INSERT INTO Dolphin VALUES("Daron", "c", 0, DEFAULT);`,
            `INSERT INTO Dolphin VALUES("Onda", "c", 0, DEFAULT);`,
            `INSERT INTO Dolphin VALUES("Draynor", "c", 0, DEFAULT);`,
            `INSERT INTO Dolphin VALUES("Calonor", "c", 0, DEFAULT);`,
        ])

        const studentQuery = await testUtils.getStudentQuery(expect)
        let result = await testUtils.getQueryResult(isSelect, studentQuery, expect, done)

        await testUtils.safeExpect(result.length, 3, "Unexpected number of dolphins found! Only return those that have 'on' *anywhere* in their name.")

        for (let r of result) {
            await testUtils.safeExpect(r.name.toLowerCase().includes("on"), true, "Found a dolphin that doesn't have 'on' in their name")
        }

        await testUtils.dropAndEndConnection()
        done() //for async
    });
})

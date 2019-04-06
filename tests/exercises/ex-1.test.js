const SqlTestUtils = require('../sql_test_utils')

describe("exercise1", () => {
    jest.setTimeout(10000) //HACK solution to let test run more than 5s default. Not sure of what we could do otherwise; it's a remote server.

    it('Should find all dolphins with a height greater than 2', async (done) => {
        const testUtils = new SqlTestUtils(expect, "Dolphin", "ex_1")
        const isSelect = true

        await testUtils.createSQLConnection()
        await testUtils.tableSetup([`
        CREATE TABLE Dolphin(
            name VARCHAR(20) NOT NULL PRIMARY KEY,
            color VARCHAR(20),
            height INT,
            healthy BOOLEAN DEFAULT TRUE
        )`,
            `INSERT INTO Dolphin VALUES("d1", "c", 0, DEFAULT);`,
            `INSERT INTO Dolphin VALUES("d2", "c", 2, DEFAULT);`,
            `INSERT INTO Dolphin VALUES("d3", "c", 3, DEFAULT);`,
            `INSERT INTO Dolphin VALUES("d4", "c", 4, DEFAULT);`,
        ])

        const studentQuery = await testUtils.getStudentQuery(expect)
        let result = await testUtils.getQueryResult(isSelect, studentQuery, expect, done)

        await testUtils.safeExpect(result.length, 2, "Unexpected number of dolphins found! Only return those with a height *greater* than 2.")

        for (let r of result) {
            await testUtils.safeExpect(r.height > 2, true, "Found a dolphin whose height is less than or equal to 2")
        }

        await testUtils.dropAndEndConnection()
        done() //for async
    });
})

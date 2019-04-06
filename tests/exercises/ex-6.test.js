const SqlTestUtils = require('../sql_test_utils')

describe("exercise1", () => {
    it('Should retrieve only the name and height for all the healthy dolphins sorted by their height (tallest to shortest)', async (done) => {
        const testUtils = new SqlTestUtils(expect, jest, "Dolphin", "ex_6")
        const isSelect = true

        await testUtils.createSQLConnection()
        await testUtils.tableSetup([`
        CREATE TABLE Dolphin(
            name VARCHAR(20) NOT NULL PRIMARY KEY,
            color VARCHAR(20),
            height INT,
            healthy BOOLEAN DEFAULT TRUE
        )`,
            `INSERT INTO Dolphin VALUES("d1", "c", 6, FALSE);`,
            `INSERT INTO Dolphin VALUES("d2", "c", 4, DEFAULT);`,
            `INSERT INTO Dolphin VALUES("d3", "c", 6, DEFAULT);`,
            `INSERT INTO Dolphin VALUES("d4", "c", 3, FALSE);`,
            `INSERT INTO Dolphin VALUES("d5", "c", 2, DEFAULT);`
        ])

        const studentQuery = await testUtils.getStudentQuery(expect)
        let result = await testUtils.getQueryResult(isSelect, studentQuery, expect, done)

        await testUtils.safeExpect(result.length, 3, "Unexpected number of dolphins! Only return the healthy ones")
        await testUtils.safeExpect(result[0].color, undefined, "Only return the name and height of the dolphins, not the other columns.")

        const expectedHeights = [6, 4, 2]
        for (let i in result) {
            await testUtils.safeExpect(result[i].height, expectedHeights[i], "Found a dolphin in the wrong order. Make sure you ORDER them BY their DESCending height")
        }

        await testUtils.dropAndEndConnection()
        done() //for async
    });
})

const SqlTestUtils = require('../sql_test_utils')

describe("exercise1", () => {
    const testUtils = new SqlTestUtils("Dolphin", "ex_1")
    afterEach(async (done) => {
        await testUtils.dropAndEndConnection()
        done()
    })

    it('Should find all dolphins with a height greater than 2', async (done) => {
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

        let studentQuery = await testUtils.getStudentQuery()
        expect(studentQuery.error, studentQuery.errorMessage).toBeFalsy()
        
        studentQuery = studentQuery.query
        let result = await testUtils.getQueryResult(isSelect, studentQuery)

        expect(result.result, result.message).not.toBeNull()
        result = result.result

        expect(result.length, "Unexpected number of dolphins found! Only return those with a height *greater* than 2.").toBe(2)

        for (let r of result) {
            expect(r.height > 2, "Your query returned a dolphin whose height is less than or equal to 2").toBe(true)
        }

        done() //for async
    });
})

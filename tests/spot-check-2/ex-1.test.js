const SqlTestUtils = require('../sql_test_utils')

describe("spotcheck2", () => {
    const testUtils = new SqlTestUtils("Deity", "check_2")
    afterEach(async (done) => {
        await testUtils.dropAndEndConnection()
        done()
    })

    it('Should select only the coolness level and names of your deities, instead of using an *', async (done) => {
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

        let studentQuery = await testUtils.getStudentQuery()
        expect(studentQuery.error, studentQuery.errorMessage).toBeFalsy()
        
        studentQuery = studentQuery.query
        let result = await testUtils.getQueryResult(isSelect, studentQuery)

        expect(result.result, result.message).not.toBeNull()
        result = result.result

        expect(result[0].name, "Remember to select the name of your deities!")
            .toBe("test-name")
        expect(result[0].coolness, "Remember to select the coolness of your deities!")
            .toBe(42)

        expect(result[0].mythology, "Should only return coolness and name columns. This query also returned mythology")
            .toBeUndefined()
        expect(result[0].main_power, "Should only return coolness and name columns. This query also returned main_power")
            .toBeUndefined()
        expect(result[0].creation_date, "Should only return coolness and name columns. This query also returned creation_date")
            .toBeUndefined()

        done() //for async
    });
})

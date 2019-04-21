const SqlTestUtils = require('../sql_test_utils')

describe("exercise1", () => {
    const testUtils = new SqlTestUtils(expect, "Deity", "check_4")
    afterEach(async (done) => {
        await testUtils.dropAndEndConnection()
        done()
    })

    it('Should query for deities that have "eh" somewhere in their name', async (done) => {
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
        VALUES(null, "breht", "myth", "dp", 0, 0);`,
            `INSERT INTO Deity
        VALUES(null, "ehmet", "myth", "dp", 0, 0);`,
            `INSERT INTO Deity
        VALUES(null, "carl", "derp", "dp", 0, 0);`
        ])

        const studentQuery = await testUtils.getStudentQuery(expect)
        let result = await testUtils.getQueryResult(isSelect, studentQuery, expect, done)

        expect(result.length, "Should return only rows where 'eh' appears somewhere in the name")
            .toBe(2)

        for (let expectedName of ["breht", "ehmet"]) {
            expect(result.some(r => r.name === expectedName), "Should return the rows where the names have an 'eh' somewhere in them")
                .toBeTruthy()
        }

        done() //for async
    });
})

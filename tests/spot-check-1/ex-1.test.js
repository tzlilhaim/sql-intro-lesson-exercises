const SqlTestUtils = require('../sql_test_utils')

describe("spotcheck1", () => {
  const testUtils = new SqlTestUtils("Deity", "check_1")
  afterEach(async (done) => {
    await testUtils.dropAndEndConnection()
    done()
  })

  it('Should insert data about the Deity Felurian. Her mythology is Faen, her power is Persuasion, she has no coolness level, and her creation date is 0', async (done) => {
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
    )`])

    let studentQuery = await testUtils.getStudentQuery()
    expect(studentQuery.error, studentQuery.errorMessage).toBeFalsy()

    studentQuery = studentQuery.query
    let result = await testUtils.getQueryResult(isSelect, studentQuery)

    expect(result.result, result.message).not.toBeNull()
    result = result.result

    expect(result[0].name, `Expected 'name' to be Felurian, instead found ${result[0].name}`).toBe("Felurian")
    expect(result[0].mythology, `Expected 'mythology' to be Faen, instead found ${result[0].mythology}`).toBe("Faen")
    expect(result[0].main_power, `Expected 'main_power' to be Persuasion, instead found ${result[0].main_power}`).toBe("Persuasion")
    expect(result[0].coolness, `Expected 'coolness' to be null, instead found ${result[0].coolness}`).toBeNull()
    expect(result[0].creation_date, `Expected 'creation_date' to be 0, instead found ${result[0].creation_date}`).toBe(0)

    done() //for async
  });
})

Make sure to change the `name` inside the `package.json`!  

SQL Tests Jest run: `jest --runInBand`
- important for running tests synchronously (so that tables can be cleared)
- also made changes in `package.json` to reflect this     

---

For ease of testing, make sure you have `mysqld` running in the background (mac).

Use the SQL shell to create a `testing_db` - you can use `CREATE DATABASE testing_db` to create this

----  

## Common Pitfall in SQL Tests
- Forgot to change file name
- Forgot to update table name
- Forgot to specifiy whether the test was a select or not (using `isSelect`)

const Pool = require("pg").Pool

const pool = new Pool({
    user: "fakeadmin",
    password: "fakeadmin",
    host: "localhost",
    port: 5432,
    database: "testdb"
});

module.exports = pool
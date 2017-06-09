const db = require("./db.js")

db.__sql.sync({force: true})

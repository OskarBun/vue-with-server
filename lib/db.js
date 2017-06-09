const Sequelize = require('sequelize');


// –– DB CONNECTION CONFIGS –– //
let config = {};
if (process.env.CLEARDB_DATABASE_URL) {

    const match = process.env.CLEARDB_DATABASE_URL.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+)\/(.+)\?/);

    config = {
        user: match[1],
        pass: match[2],
        base: match[4],
        options: {
            dialect: 'mysql',
            protocol: 'mysql',
            host: match[3],
            port: 3306,
            logging: false,
            dialectOptions: {
                ssl: true
            }
        }
    };

} else {
    config = {
        user: 'root',
        pass: 'root',
        base: 'travelo-development',
        options: {
            host: 'localhost',
            dialect: 'sqlite',

            pool: {
                max: 5,
                min: 0,
                idle: 10000
            },

            // SQLite only
            storage: __dirname + '/../db.sqlite'
        }
    };
}

// –– INIT DB –– //
const sequelize = new Sequelize(config.base, config.user, config.pass, config.options);


// –– MODEL –– //



// –– DROP AND CREATE –– //
sequelize.sync({force:false}); // false means dont do it


// –– EXPORTS –– //
module.exports = {
    __sql: sequelize
}

const fs = require('fs');

const isDev = () => {
    return process.env.NODE_ENV === 'development';
};

let configs = {
    type: 'mysql',
    host: isDev() ? 'localhost' : process.env.DATABASE_HOST,
    port: 3306,
    username: isDev()
        ? process.env.TYPEORM_USERNAME
        : process.env.DATABASE_USERNAME,
    password: isDev()
        ? process.env.TYPEORM_PASSWORD
        : process.env.DATABASE_PASSWORD,
    database: isDev()
        ? process.env.TYPEORM_DATABASE
        : process.env.DATABASE_NAME,

    synchronize: true,
    logging: false,
    entities: ['src/entities/**/*.ts', 'dist/entities/**/*.js'],
    subscribers: ['src/subscribers/**/*.ts', 'dist/subscribers/**/*.js'],
    migrations: ['src/migrations/**/*.ts', 'dist/migrations/**/*.js'],
    cli: {
        entitiesDir: 'src/entities',
        migrationsDir: 'src/migrations',
        subscribersDir: 'src/subscribers',
    },
};

if (!isDev()) {
    // if production
    configs.ssl = {
        ca: fs.readFileSync(__dirname + '/ssl/cacert.pem'),
    };
}

module.exports = configs;

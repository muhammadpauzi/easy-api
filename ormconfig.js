module.exports = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
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

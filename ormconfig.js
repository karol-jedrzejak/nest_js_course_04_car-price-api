var dbConfig = {
    synchronize: false,
    migrations: ['src/migrations/*.js'],
    cli: {
        migrationsDir: 'migrations',
    }
};

switch(process.env.NODE_ENV){
    case 'development':
        Object.assign(dbConfig,{
            type: 'better-sqlite3',
            database: 'db.sqlite',
            entities: ['**/*.entity.js'],
        });
        break;
    case 'test':
        Object.assign(dbConfig,{
            type: 'better-sqlite3',
            database: 'test.sqlite',
            entities: ['**/*.entity.ts'],
            migrationsRun: true,
        });
        break;
    case 'production':
        break;
    default:
        throw new Error('unknown environment');
}

export default dbConfig;
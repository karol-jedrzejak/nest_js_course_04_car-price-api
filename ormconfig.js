var dbConfig = {
    synchronize: false,
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
        });
        break;
    case 'production':
        break;
    default:
        throw new Error('unknown environment');
}

export default dbConfig;
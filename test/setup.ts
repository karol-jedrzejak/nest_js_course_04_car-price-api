import { rm } from 'fs/promises';
import {join} from 'path';

global.BeforeEach(async () => {
    try {
        await rm(join(__dirname, '..', 'db.sqlite'), {force: true});
    } catch (err) {
        console.error('Error removing database file:', err);
    }
});
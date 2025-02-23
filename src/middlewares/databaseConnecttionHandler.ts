// libs
import { Request, Response, NextFunction } from 'express';

// utils
import logger from '../utils/logger';
import { createDatabaseConnection } from '../utils/database';

const databaseConnectionHandler = async () => {
    try {
        // logger.info('', { status: 'start', method: 'CONNECTION DATABASE', apiName: '/database' });

        const db = await createDatabaseConnection();

        return new Promise<void>((resolve, reject) => {
            db.connect((err) => {
                if (err) {
                    console.log('CONNECTION DATABASE FAIL!!!');
                    return reject(err);
                } else {
                    console.log('CONNECTION DATABASE SUCCESSFULLY!!!');
                }
                db.destroy();
                return resolve();
            });
        });

        // logger.info('successfully', { status: 'end', method: 'CONNECTION DATABASE', apiName: '/database' });
    } catch (error: any) {
        logger.error('fail', { status: 'end', method: 'CONNECTION DATABASE', apiName: '/database' });
        return;
    }
};

export default databaseConnectionHandler;

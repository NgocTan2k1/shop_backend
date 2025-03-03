//libs
import { Connection, createConnection, QueryOptions } from 'mysql';

export const createDatabaseConnection = async () =>
    createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        port: parseInt(process.env.DATABASE_PORT || '3006'),
    });

export const queryPromise = async <T>(query: string, values: any[]) => {
    const db = await createDatabaseConnection();
    db.connect();

    return new Promise<T>((resolve, reject) => {
        db.query(query, values, (error, results) => {
            if (error) {
                db.destroy();
                return reject(error);
            }
            db.destroy();
            return resolve(results);
        });
    });
};

/** ========== Create transaction ========== */
/**
 * Create transaction function
 * @returns Connection
 */
export const createTransaction = async () => {
    const transaction = await createDatabaseConnection();
    transaction.connect();

    return new Promise<Connection>((resolve, reject) => {
        transaction.beginTransaction((err) => {
            if (err) {
                return reject(err);
            }
            return resolve(transaction);
        });
    });
};

/**
 * Query promise transaction
 * @param transaction : Transaction connection
 * @param query : string | QueryOptions
 * @param params : any
 * @returns query promise
 */
export const queryPromiseTransaction = async <T>(transaction: Connection, query: string | QueryOptions, params: any) =>
    new Promise<T>((resolve, reject) => {
        transaction.query(query, params, (error, results) => {
            if (error) return reject(error);

            return resolve(results);
        });
    });

/**
 * Rollback transaction function
 * @param transaction : Transaction connection
 * @returns rollback transaction promise
 */
export const rollback = async (transaction: Connection) =>
    new Promise((resolve, reject) => {
        transaction.rollback((err) => {
            if (err) {
                return reject(err);
            }
            return resolve(transaction);
        });
    });

/**
 * Commit transaction function
 * @param transaction : Transaction connection
 * @returns commit transaction promise
 */
export const commit = async (transaction: Connection) =>
    new Promise((resolve, reject) => {
        transaction.commit((err) => {
            if (err) {
                return reject(err);
            }
            return resolve(transaction);
        });
    });

/**
 * End transaction function
 * @param transaction : Transaction connection
 * @returns end transaction promise
 */
export const end = async (transaction: Connection) =>
    new Promise((resolve, reject) => {
        transaction.end((err) => {
            if (err) {
                return reject(err);
            }
            return resolve(transaction);
        });
    });

/** =============== transaction =============== */

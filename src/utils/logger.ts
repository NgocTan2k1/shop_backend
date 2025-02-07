import winston, { format, transports } from 'winston';
import { compareAsc, format as dateFormat } from 'date-fns';

const myFormat = format.printf(({ status, level, method, apiName, ...args }) => {
    const timestamp = dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss:SSS');
    return JSON.stringify({
        Time: timestamp,
        Status: status,
        Label: level,
        Method: method,
        API: apiName,
        ...args,
    });
});

const logger = winston.createLogger({
    level: 'info',
    format: format.combine(myFormat),
    transports: [
        new transports.Console(), // write with console
        new transports.File({
            filename: 'logs/error.log',
            level: 'error',
        }), // write error log into file
        new transports.File({ filename: 'logs/combined.log' }), // write all log into file
    ],
});

export default logger;

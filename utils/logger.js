import winston from 'winston';

const fileFormat = winston.format.combine(
    winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}), 
    winston.format.errors({ stack: true }), 
    winston.format.prettyPrint({ depth: 10 }),
    winston.format.json({ space: 4 }),
);

const consoleFormat = winston.format.combine(
    winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}), 
    winston.format.errors({ stack: true }), 
    winston.format.colorize(),
    winston.format.printf(info => `${info.timestamp} - ${info.level}: ${info.message}`),
);

const logger = winston.createLogger(
    {
        transports: [
            new winston.transports.File({
                filename: 'logs/error.log',
                level: 'error',
                format: fileFormat,
            }),
            new winston.transports.File({
                filename: 'logs/info.log',
                level: 'info',
                format: fileFormat,
            }),
        ]
    }
);

if (process.env.NODE_ENV !== 'PRODUCTION') {
    logger.add(new winston.transports.Console({
        level: 'error',
        format: consoleFormat,
    }));
}

/**
 * Write to error log
 * @param {string} message Message to write
 * @returns {Promise<void>}
 */
async function writeError(message) {
    logger.error(message);
}

/**
 * Write to info log
 * @param {string} message Message to write
 * @returns {Promise<void>}
 */
async function writeInfo(message) {
    logger.info(message);
}

/**
 * Go to error handler
 * @param {unknown} error Unknown
 * @returns {Promise<void>}
 */
async function logError(error) {
    if (error instanceof Error) {
        if (process.env.NODE_ENV === 'PRODUCTION') {
            await writeError(error.message);
        } else if (process.env.NODE_ENV === 'DEVELOPMENT') {
            if (error.stack !== undefined) {
                await writeError(error.stack);
            } else {
                await writeError(error.message);
            }
        } else {
            await writeError("Unknown error occurred");
        }
    } else if (typeof error === 'string') {
        await writeError(error);
    } else {
        await writeError("Unknown error occurred");
    }
}

/**
 * Logs to info.log
 * @param {string} message Message
 */
async function logInfo(message) {
    try {
        await writeInfo(message);
    } catch (error) {
        await logError(error);
    }
}

export {
    logError,
    logInfo,
};
import * as UUID from 'uuid/v4';
import 'ts-polyfill/lib/es2015-collection'; // Polyfill for Map()

import AsyncHook,
{
    setSharedVariable,
    getSharedVariable,
} from './async-hooks';

/**
 * Middleware that enable Async hooks and set the unique logging transaction id
 * @param req request
 * @param res response
 * @param next next callback function
 */
const ExpressLoggingUtilityMiddleware = (req, res, next) => {
    const loggingId = UUID();
    AsyncHook(loggingId, {
        loggingId,
    });
    next();
};

/**
 * Set variables per each request context
 * @param {any} key Variable name
 * @param {any} value variable value
 */
const set = (key: any, value: any) => {
    return setSharedVariable(key, value);
};

/**
 * Get variables related to current context
 * @param {any} key Name of the variable to be retrieved
 */
const get = (key: any) => {
    return getSharedVariable(key);
};

export = {
    set,
    get,
    middleware: ExpressLoggingUtilityMiddleware,
};
import {
    createHook,
    executionAsyncId,
    triggerAsyncId,
} from 'async_hooks';

const contexts = new Map(); // List of all resource async ids and their context

let activeContextRef = null; // Current context object

/**
 * Called when asynchronous event is just emitted.
 * @param {number} asyncId Unique id for async resource
 * @param {string} type Resource type
 * @param {number} triggerId Async id of the parent resource
 * @param {object} resource Resource object
 */
const initHandler = (asyncId: number, type: string, triggerId: number, resource: object) => {
    const contextId = executionAsyncId();
    if (activeContextRef) {
        contexts.set(asyncId, activeContextRef);
    } else if (contextId === 0) {
        // executionAsyncId Returns 0 for C++ async resources. In which case we get triggered resource async id.
        contexts.set(asyncId, contexts.get(triggerAsyncId()));
    }
};

/**
 * Called before async operation executes
 * @param {number} asyncId Unique id for async resource
 */
const beforeHandler = (asyncId: number) => {
    activeContextRef = contexts.get(asyncId);
};

/**
 * Called after async operation is executed
 * @param {number} asyncId Unique id for async resource
 */
const afterHandler = (asyncId: number) => {
    activeContextRef = contexts.get(asyncId);
};

/**
 * Called after async resource is destroyed.
 * @param {number} asyncId Unique id for async resource
 */
const destroyHandler = (asyncId: number) => {
    contexts.delete(asyncId);
};

/**
 * Enable async_hooks ( High level Node api to track async operations)
 */
const enableAsyncHook = () => {
    const asyncHook = createHook({
        init: initHandler,
        before: beforeHandler,
        after: afterHandler,
        destroy: destroyHandler,
    });

    asyncHook.enable();

};

/**
 * Set variables per each request context
 * @param {any} key Variable name
 * @param {any} value variable value
 */
export const setSharedVariable = (key: any, value: any) => {
    if (activeContextRef) {

        activeContextRef.sharedVariables = {
            ...activeContextRef.sharedVariables,
            [key]: value,
        };

        contexts.set(activeContextRef.id, activeContextRef);
    }
};

/**
 * Get variables related to current context
 * @param {any} key Name of the variable to be retrieved
 */
export const getSharedVariable = (key: any) => {
    if (activeContextRef) {
        return activeContextRef.sharedVariables[key];
    }
    return;
};

/**
 * Context object which holds unique id and shared variables
 */
class Context {
    id = null;
    sharedVariables = null;

    /**
     * @param {any} uuid unique id for given context
     * @param {object} sharedVariable  Hold variables for given context
     */
    constructor(uuid: any, sharedVariable: object) {
        this.id = uuid;
        this.sharedVariables = sharedVariable;
    }
}

/**
 * @param {any} uuid Unique identifier
 * @param {object} loggingId Unique logging transaction object with "loggingId" as key and uuid as value
 */
const AsyncHook = (uuid: any, loggingId: object) => {

    const context = new Context(uuid, loggingId);

    if (!activeContextRef) {
        enableAsyncHook();
    }

    contexts.set(uuid, context);
    activeContextRef = context;
};

export default AsyncHook;
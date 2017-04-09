import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {syncHistoryWithStore, routerMiddleware} from 'react-router-redux';
import {browserHistory} from 'react-router';
import createLogger from 'redux-logger';

import RootReducer from './RootReducer.js';


const level = 'log';
const logger = {};

for (const method in console) {
    if (console.hasOwnProperty(method) && typeof console[method] === 'function')
        logger[method] = console[method].bind(console);
}

logger[level] = function levelFn(...args) {
    const lastArg = args.pop();

    if (Array.isArray(lastArg))
        return lastArg.forEach(item => {
            console[level].apply(console, [...args, item]);
        });

    console[level].apply(console, arguments);
};

const loggerMiddleware = createLogger({
    logger: logger,
    level: level,
    duration: true,
    timestamp: true,
    logErrors: true
});



const createStoreWithMiddleware = applyMiddleware(routerMiddleware(browserHistory), thunkMiddleware, loggerMiddleware)(createStore);

const store = createStoreWithMiddleware(RootReducer);

export default store;

export const history = syncHistoryWithStore(browserHistory, store);

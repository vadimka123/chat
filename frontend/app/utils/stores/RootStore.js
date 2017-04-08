import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {syncHistoryWithStore, routerMiddleware} from 'react-router-redux';
import {browserHistory} from 'react-router';

import RootReducer from './RootReducer.js';


const createStoreWithMiddleware = applyMiddleware(routerMiddleware(browserHistory), thunkMiddleware)(createStore);

const store = createStoreWithMiddleware(RootReducer);

export default store;

export const history = syncHistoryWithStore(browserHistory, store);

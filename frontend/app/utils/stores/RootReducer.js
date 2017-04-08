import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import AccountReducer from '../../accounts/reducers/AccountReducer.js';
import ChatReducer from '../../chat/reducers/ChatReducer.js';


export default combineReducers({
    AccountReducer,
    ChatReducer,
    routing: routerReducer
});

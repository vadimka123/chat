import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import AccountReducer from '../../accounts/reducers/AccountReducer.js';
import RoomReducer from '../../chat/reducers/RoomReducer.js';


export default combineReducers({
    AccountReducer,
    RoomReducer,
    routing: routerReducer
});

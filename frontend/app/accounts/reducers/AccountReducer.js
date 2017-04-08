import {LOCATION_CHANGE} from 'react-router-redux';

import {AccountConstants, USER_TYPE_TEAM_CHIEF} from '../Constants.js';
import {JwtHelper} from '../utils/jwt.js';
import {setupAuthHeader} from '../utils/utils.js';


const jwt = new JwtHelper();

export class AuthHelper {
    static get isAuthenticated() {
        let token = AuthHelper.token;

        if (!token)
            return false;

        if (jwt.isTokenExpired(token, 0)) {
            AuthHelper.clearAuthStorage();
            return false;
        }

        return true;
    };

    static get isStaff() {
        return AuthHelper.isAuthenticated && AuthHelper.user.account_type === USER_TYPE_TEAM_CHIEF;
    };

    static get token() {
        return localStorage.getItem('jwtToken');
    };

    static get user() {
        return JSON.parse(localStorage.getItem('userData')) || {};
    };

    static authorizeToken(token) {
        let userData = jwt.decodeToken(token);
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('jwtToken', token);
        return userData;
    };

    static clearAuthStorage() {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userData');
    };

    static get JwtHeader() {
        return `JWT ${AuthHelper.token}`;
    };

    static get tokenExpirationDate() {
        return jwt.getTokenExpirationDate(AuthHelper.token);
    };
}

const initialState = {
    user: JSON.parse(localStorage.getItem('userData')) || {},
    users: [],
    fetchDevUsers: true,
    errors: {},
    lock: false,
    provider: null
};


export default (state=initialState, action) => {
    switch(action.type) {
        case LOCATION_CHANGE:
            state.users = [];
            state.fetchDevUsers = true;
            state.errors = {};
            state.lock = false;
            state.provider = false;
            break;

        case AccountConstants.SUBMIT_FORM:
            state.lock = true;
            if (action.provider)
                state.provider = action.provider;
            break;

        case AccountConstants.JWT_REFRESH_SUCCESS:
        case AccountConstants.LOGIN_SUCCESS:
        case AccountConstants.REGISTER_SUCCESS:
            if (action.data.token)
                state.user = AuthHelper.authorizeToken(action.data.token);
            state.lock = false;
            state.errors = {};
            setupAuthHeader();
            break;

        case AccountConstants.LOGIN_FAIL:
        case AccountConstants.REGISTER_FAIL:
            state.errors = action.data;
            state.lock = false;
            break;

        case AccountConstants.USER_LIST_SUCCESS:
            state.users = action.data;
            state.fetchDevUsers = false;
            break;

        case AccountConstants.USER_LIST_FAIL:
            state.users = [];
            state.fetchDevUsers = false;
            break;

        case AccountConstants.LOGOUT:
            state.user = {};
            AuthHelper.clearAuthStorage();
            break;
    }

    return state;
};

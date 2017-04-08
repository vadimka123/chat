import axios from 'axios';
import _ from 'lodash';

import {AuthHelper} from '../reducers/AccountReducer.js';
import {AccountActions} from '../actions/AccountActions.js';
import store from '../../utils/stores/RootStore.js';


let timeout = null, interval = null;

export function setupAuthHeader() {
    if (!AuthHelper.token) return;

    axios.defaults.headers.common['Authorization'] = AuthHelper.JwtHeader;
}

export function requireAuth(nextState, replace) {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }

    if (interval) {
        clearInterval(interval);
        interval = null;
    }

    if (AuthHelper.isAuthenticated && AuthHelper.tokenExpirationDate) {
        let timeToExpired = AuthHelper.tokenExpirationDate - new Date().valueOf() - 5000;

        timeout = setTimeout(() => {
            store.dispatch(AccountActions.refreshToken());
            interval = setInterval(() => {
                store.dispatch(AccountActions.refreshToken());
            }, 5400000)
        }, (timeToExpired && timeToExpired > 0) ? timeToExpired : 0);
    }

    if (AuthHelper.isAuthenticated) return;

    let next = nextState.location.pathname;
    let path = '/accounts/login';

    if (next != '/')
        path += '?next='+next;

    replace(path);
}

export function requireStaff(nextState, replace) {
    if (AuthHelper.isAuthenticated && AuthHelper.isStaff) return;

    replace('/');
}

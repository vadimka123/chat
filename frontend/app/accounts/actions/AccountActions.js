import axios from 'axios';
import {replace} from 'react-router-redux';

import {AuthHelper} from '../reducers/AccountReducer.js';
import {AccountConstants} from '../Constants.js';


class _AccountActions {
    list() {
        return dispatch => {
            axios.get('/api/v1/account/').then(response => {
                dispatch({
                    type: AccountConstants.DEVELOPER_LIST_SUCCESS,
                    data: response.data
                });
            }).catch(error => {
                dispatch({
                    type: AccountConstants.DEVELOPER_LIST_FAIL,
                    data: error.response ? error.response.data : {}
                });
            });
        }
    }

    login(username, password, nextUrl) {
        return dispatch => {
            dispatch({
                type: AccountConstants.SUBMIT_FORM,
                provider: 'form'
            });

            axios.post('/api/v1/account/token/obtain/', {
                username: username,
                password: password
            }).then(response => {
                dispatch({
                    type: AccountConstants.LOGIN_SUCCESS,
                    data: response.data
                });
                dispatch(replace(nextUrl));
            }).catch(error => {
                dispatch({
                    type: AccountConstants.LOGIN_FAIL,
                    data: error.response ? error.response.data : {}
                });
            });
        }
    }

    register(data) {
        return dispatch => {
            dispatch({
                type: AccountConstants.SUBMIT_FORM
            });

            axios.post('/api/v1/account/token/register/', data).then(response => {
                dispatch({
                    type: AccountConstants.REGISTER_SUCCESS,
                    data: response.data
                });
                dispatch(replace('/'));
            }).catch(error => {
                dispatch({
                    type: AccountConstants.REGISTER_FAIL,
                    data: error.response ? error.response.data : {}
                });
            });
        }
    }

    refreshToken() {
        return dispatch => {
            axios.post('/api/v1/account/token/refresh/', {
                token: AuthHelper.token
            }).then(response => {
                dispatch({
                    type: AccountConstants.JWT_REFRESH_SUCCESS,
                    data: response.data
                });
            }).catch(error => {
                dispatch({
                    type: AccountConstants.JWT_REFRESH_FAIL,
                    data: error.response ? error.response.data : {}
                });

                if (error.response && error.response.status === 400)
                    dispatch(AccountConstants.logout());
            });
        }
    }

    logout() {
        return dispatch => {
            dispatch({
                type: AccountConstants.LOGOUT
            });

            dispatch(replace(`/accounts/login/?next=${window.location.pathname}`));
        }
    }
}

export const AccountActions = new _AccountActions();

import axios from 'axios';

import {RoomConstants} from '../Constants.js';


class _ChatActions {
    list() {
        return dispatch => {
            axios.get('/api/v1/room/').then(response => {
                dispatch({
                    type: RoomConstants.ROOM_LIST_SUCCESS,
                    data: response.data
                });
            }).catch(error => {
                dispatch({
                    type: RoomConstants.ROOM_LIST_FAIL,
                    data: error.response ? error.response.data : {}
                });
            });
        }
    }

    createMessage(message) {
        return dispatch => {
            dispatch({
                type: RoomConstants.MESSAGE_CREATE,
                message: message
            });

            axios.post('/api/v1/message/', message).then(response => {
                dispatch({
                    type: RoomConstants.MESSAGE_CREATE_SUCCESS,
                    message: message,
                    data: response.data
                });
            }).catch(error => {
                dispatch({
                    type: RoomConstants.MESSAGE_CREATE_FAIL,
                    message: message,
                    data: error.response ? error.response.data : {}
                });
            });
        }
    }
}

export const ChatActions = new _ChatActions();

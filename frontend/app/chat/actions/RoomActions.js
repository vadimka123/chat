import axios from 'axios';

import {RoomConstants} from '../Constants.js';


class _RoomActions {
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
}

export const RoomActions = new _RoomActions();

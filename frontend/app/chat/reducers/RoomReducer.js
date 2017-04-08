import {LOCATION_CHANGE} from 'react-router-redux';
import _ from 'lodash';

import {RoomConstants} from '../Constants.js';


const initialState = {
    rooms: []
};

export default (state=initialState, action) => {
    switch (action.type) {
        case LOCATION_CHANGE:
            state = {
                rooms: []
            };
            break;

        case RoomConstants.ROOM_LIST_SUCCESS:
            state.rooms = action.data;
            break;

        case RoomConstants.ROOM_LIST_FAIL:
            state.rooms = [];
            break;
    }

    return state;
}

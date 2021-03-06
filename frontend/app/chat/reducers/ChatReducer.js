import {LOCATION_CHANGE} from 'react-router-redux';
import _ from 'lodash';

import {RoomConstants} from '../Constants.js';


const initialState = {
    rooms: [],
    saving: false,
    inputValues: {}
};

export default (state=initialState, action) => {
    switch (action.type) {
        case LOCATION_CHANGE:
            state = {
                rooms: [],
                saving: false,
                inputValues: {}
            };
            break;

        case RoomConstants.ROOM_LIST_SUCCESS:
            state.rooms = action.data;
            break;

        case RoomConstants.ROOM_LIST_FAIL:
            state.rooms = [];
            break;

        case RoomConstants.ROOM_INPUT_VALUE_CHANGE:
            let newInput = {};
            newInput[action.room] = action.value;
            state.inputValues = _.merge({}, state.inputValues, newInput);
            break;

        case RoomConstants.ROOM_CREATE:
            state.saving = true;
            break;

        case RoomConstants.ROOM_CREATE_SUCCESS:
            state.saving = false;
            state.rooms = _.concat([], state.rooms, [action.data]);
            break;

        case RoomConstants.ROOM_CREATE_FAIL:
            // TODO: handle errors
            state.saving = false;
            break;

        case RoomConstants.MESSAGE_CREATE:
            state.rooms = _.map(state.rooms, room => {
                if (action.message.room === room.id)
                    room.messages = _.concat([], room.messages, [action.message]);

                return room;
            });
            delete state.inputValues[action.message.room];
            break;

        case RoomConstants.MESSAGE_CREATE_SUCCESS:
            state.rooms = _.map(state.rooms, room => {
                if (action.data.room === room.id)
                    room.messages = action.message ? _.map(room.messages, message => {
                        if (message.tmpId && message.tmpId === action.message.tmpId) {
                            delete action.message.tmpId;
                            message = _.merge({}, message, action.data);
                        }

                        return message;
                    }) : _.concat([], room.messages, [action.data]);

                return room;
            });
            break;

        case RoomConstants.MESSAGE_CREATE_FAIL:
            // TODO: pass ?
            break;
    }

    return state;
}

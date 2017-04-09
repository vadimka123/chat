import io from 'socket.io-client';
import _ from 'lodash';


class _Socket {
    constructor(url) {
        this._socket = null;
        this._url = url;
    }

    get url() {
        return this._url;
    }

    set url(value) {
        this._url = value;
    }

    connect(rooms) {
        this._socket = io.connect(this.url);

        this._socket.on('connect', () => {
            _.map(rooms, room => {
                this._socket.emit('room', room.id);
            });
        });
    }

    addEventListener(socketEvent, rooms, func) {
        if (!this._socket)
            this.connect(rooms);

        this._socket.addEventListener(socketEvent, func);
    }

    removeEventListener(socketEvent, func) {
        this._socket.removeEventListener(socketEvent, func);
    }

    removeAllListeners(socketEvent) {
        this._socket.removeAllListeners(socketEvent);
    }

    disconnect() {
        if (this._socket)
            this._socket.disconnect();

        this._socket.on('disconnect', () => {
            this._socket = null;
        });
    }
}

export const Socket = new _Socket(window.location.origin);

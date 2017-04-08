from flask import Flask, Response
import socketio

sio = socketio.Server(async_mode='eventlet')
flask_app = Flask(__name__)
app = socketio.Middleware(sio, flask_app)


@flask_app.route('/')
def index():
    return Response("Websocket Server is OK! Thanks for asking.")


@sio.on('connect')
def connect(sid, env):
    print("Client {} connected".format(sid))


@sio.on('room')
def enter_room(sid, room):
    sio.enter_room(sid, room)
    print("Client {} entered room {}".format(sid, room))


@sio.on('disconnect')
def disconnect(sid):
    print("Client {} disconnected".format(sid))

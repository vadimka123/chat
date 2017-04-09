import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentSend from 'material-ui/svg-icons/content/send';
import IconButton from 'material-ui/IconButton';
import {pink500} from 'material-ui/styles/colors';
import uuidV4 from 'uuid/v4';
import _ from 'lodash';
import moment from 'moment';

import globalStyles from '../../styles.js';

import {AccountActions} from '../../accounts/actions/AccountActions.js';
import {ChatActions} from '../actions/ChatActions.js';
import {RoomConstants} from '../Constants.js';

import {CreateRoomModal} from './CreateRoomModal.jsx';

import {Socket} from '../../utils/Socket.js';


const styles = {
    floatingActionButton: {
        margin: 0,
        top: 'auto',
        right: 20,
        bottom: 20,
        left: 'auto',
        position: 'fixed',
    }
};

@connect(state => state.AccountReducer)
class MessageItem extends PureComponent {
    static displayName = 'Message Item';

    static propTypes = {
        message: PropTypes.object.isRequired,
        index: PropTypes.number.isRequired
    };

    render() {
        const {message, index} = this.props;

        const userAvatar = <Avatar src="https://upload.wikimedia.org/wikipedia/commons/1/1e/Default-avatar.jpg" />;

        let props = {
            primaryText: message.user.username,
            secondaryText: message.message
        };

        props[this.props.user.id === message.user.id ? 'leftAvatar' : 'rightAvatar'] = userAvatar;

        return <ListItem {...props} />;
    };
}

@connect(state => ({
    ...state.ChatReducer,
    ...state.AccountReducer
}), null, null, {pure: false})
class MessageList extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            showCreateModal: false
        };
    };

    static displayName = 'Message List';

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        activeRoom: PropTypes.object.isRequired
    };

    componentWillMount() {
        this.props.dispatch(AccountActions.list());
    };

    componentWillReceiveProps(nextProps) {
        if (_.isEqual(this.props.rooms, nextProps.rooms)) return;

        Socket.addEventListener('message_create', nextProps.rooms, ::this.message_create);
    };

    message_create(data) {
        if (data.user.id === this.props.user.id) return;

        this.props.dispatch({
            type: RoomConstants.MESSAGE_CREATE_SUCCESS,
            data: data
        });
    };

    changeInput(value) {
        this.props.dispatch({
            type: RoomConstants.ROOM_INPUT_VALUE_CHANGE,
            room: this.props.activeRoom.id,
            value: value
        })
    };

    submit() {
        if (!this.props.inputValues[this.props.activeRoom.id]) return;

        this.props.dispatch(ChatActions.createMessage({
            tmpId: uuidV4(),
            user: this.props.user,
            room: this.props.activeRoom.id,
            message: this.props.inputValues[this.props.activeRoom.id]
        }));
    };

    render() {
        const {activeRoom, inputValues} = this.props;

        return (
            <Paper style={globalStyles.paper}>
                <h3 style={globalStyles.title}>{activeRoom.name}</h3>
                <Divider />
                <FloatingActionButton style={styles.floatingActionButton} backgroundColor={pink500}
                                      onClick={() => this.setState({showCreateModal: true})}>
                    <ContentAdd />
                    <CreateRoomModal show={this.state.showCreateModal}
                                     onHide={() => this.setState({showCreateModal: false})} />
                </FloatingActionButton>
                {_.map(activeRoom.messages, (message, index) =>
                    <div key={index}>
                        <List>
                            <MessageItem key={message.id || message.tmpId} index={index} message={message} />
                        </List>
                        <Divider />
                    </div>
                )}
                <TextField hintText="Enter your Message" floatingLabelText="Enter your Message"
                           fullWidth={true} rows={3} rowsMax={3} multiLine={true} style={{width: '80%'}}
                           value={inputValues[activeRoom.id] || ''}
                           onChange={e => this.changeInput(e.target.value)} />
                <IconButton onTouchTap={::this.submit}><ContentSend /></IconButton>
                <div style={globalStyles.clear} />
            </Paper>
        );
    };
}

export default MessageList;

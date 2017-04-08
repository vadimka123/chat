import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {pink500} from 'material-ui/styles/colors';
import uuidV4 from 'uuid/v4';
import _ from 'lodash';
import moment from 'moment';

import globalStyles from '../../styles.js';

import {AccountActions} from '../../accounts/actions/AccountActions.js';
import {ChatActions} from '../actions/ChatActions.js';
import {RoomConstants} from '../Constants.js';

import {CreateRoomModal} from './CreateRoomModal.jsx';


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

        const userAvatar = <Avatar src={index === 0 ?
                              "https://upload.wikimedia.org/wikipedia/commons/1/1e/Default-avatar.jpg":
                              "https://www.transparenttextures.com/patterns/asfalt-light.png"} style={{
                                  backgroundColor: 'transparent'
                              }} />;

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
    }

    groupMessages(messages) {
        let result = {}, resultKeys = [], prev_message = null;

        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];

            if (!prev_message) {
                result[`${message.user.id}_${message.sended}`] = [message];
                resultKeys.push(`${message.user.id}_${message.sended}`);
                prev_message = message;
                continue;
            }

            let grouped = false;

            for (let j = 0; j < resultKeys.length; j++) {
                const r = resultKeys[j].split('_');
                const user_id = r[0], sended = r[1];

                if (parseInt(user_id) === message.user.id && moment(message.sended).diff(sended) <= 300000) {
                    result[`${message.user.id}_${sended}`].push(message);
                    grouped = true;
                    break;
                }
            }

            if (!grouped) {
                result[`${message.user.id}_${message.sended}`] = [message];
                resultKeys.push(`${message.user.id}_${message.sended}`);
            }

            prev_message = message;
        }

        return result;
    };

    changeInput(value) {
        this.props.dispatch({
            type: RoomConstants.ROOM_INPUT_VALUE_CHANGE,
            room: this.props.activeRoom.id,
            value: value
        })
    };

    submit(e) {
        if (!e.ctrlKey || e.keyCode !== 13 || !this.props.inputValues[this.props.activeRoom.id]) return;

        this.props.dispatch(ChatActions.createMessage({
            tmpId: uuidV4(),
            user: this.props.user,
            room: this.props.activeRoom.id,
            message: this.props.inputValues[this.props.activeRoom.id]
        }));
    };

    render() {
        const {activeRoom, inputValues} = this.props;

        const messagesGroup = this.groupMessages(_.clone(activeRoom.messages) || []);

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
                {_.map(messagesGroup, (messages, key) =>
                    <div key={key}>
                        <List>
                            {_.map(messages, (message, index) =>
                                <MessageItem key={message.id} index={index} message={message} />
                            )}
                        </List>
                        <Divider />
                    </div>
                )}
                <TextField hintText="Enter your Message" floatingLabelText="Enter your Message"
                           fullWidth={true} rows={3} rowsMax={3} multiLine={true}
                           value={inputValues[activeRoom.id] || ''} onKeyDown={::this.submit}
                           onChange={e => this.changeInput(e.target.value)} />
                <div style={globalStyles.clear} />
            </Paper>
        );
    };
}

export default MessageList;

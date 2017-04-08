import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';
import _ from 'lodash';
import moment from 'moment';

import globalStyles from '../../styles.js';


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

@connect()
class MessageList extends PureComponent {
    static displayName = 'Message List';

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        activeRoom: PropTypes.object.isRequired
    };

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

    render() {
        const {activeRoom} = this.props;

        const messagesGroup = this.groupMessages(_.clone(activeRoom.messages) || []);

        return (
            <Paper style={globalStyles.paper}>
                <h3 style={globalStyles.title}>{activeRoom.name}</h3>
                <Divider />
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
                <div style={globalStyles.clear} />
            </Paper>
        );
    };
}

export default MessageList;

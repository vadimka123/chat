import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import _ from 'lodash';

import {ChatActions} from '../actions/ChatActions.js';


@connect(state => ({
    user: state.AccountReducer.user,
    users: state.AccountReducer.users,
    ...state.ChatReducer
}), null, null, {pure: false})
export class CreateRoomModal extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            name: null,
            private: false,
            allowed_users: []
        };
    };

    static displayName = 'Create Root Modal';

    static propTypes = {
        dispatch: PropTypes.func.isRequired
    };

    componentWillReceiveProps(nextProps) {
        if (!this.props.saving || nextProps.saving) return;

        nextProps.onHide();
        this.setState({
            name: null,
            private: false,
            allowed_users: []
        });
    };

    changeInput(key, value) {
        let newState = {};
        newState[key] = value;
        this.setState(newState);
    };

    menuItems(allowed_users) {
        const {users} = this.props;

        return _.map(users, user =>
            <MenuItem key={user.id} insetChildren={true} value={user.id} primaryText={user.username}
                      checked={_.includes(allowed_users, user.id)}/>
        );
    };

    handleSubmit() {
        this.props.dispatch(ChatActions.createRoom(_.merge({}, this.state, {
            created_at: this.props.user.id
        })));
    };

    render() {
        const {name, allowed_users} = this.state;
        const priv = this.state.private;
        const {saving} = this.props;

        const actions = [
            <FlatButton label="Cancel" secondary={true} onTouchTap={this.props.onHide} disabled={saving} />,
            <FlatButton label="Create" primary={true} onTouchTap={::this.handleSubmit}
                        disabled={!name || (priv && allowed_users.length === 0)} />
        ];

        return (
            <Dialog title="Create new Room" actions={actions} modal={false} open={this.props.show}
                    onRequestClose={this.props.onHide}>
                <form>
                    <TextField hintText="Name" floatingLabelText="Name" fullWidth={true}
                               value={name || ''} disabled={saving}
                               onChange={e => this.changeInput('name', e.target.value)} />
                    <Checkbox checkedIcon={<Visibility />} uncheckedIcon={<VisibilityOff />}
                              style={{marginTop: 10, marginBottom: 10}}
                              label="Public" checked={!priv} onCheck={e => this.changeInput('private', !priv)} />
                    {priv &&
                        <SelectField multiple={true} hintText="Select users" value={allowed_users}
                                     onChange={(event, index, values) => this.changeInput('allowed_users', values)}>
                            {this.menuItems(allowed_users)}
                        </SelectField>
                    }
                </form>
            </Dialog>
        );
    };
}

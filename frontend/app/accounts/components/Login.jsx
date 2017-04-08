import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {grey500, white} from 'material-ui/styles/colors';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import Help from 'material-ui/svg-icons/action/help';
import TextField from 'material-ui/TextField';
import {Link} from 'react-router';

import ThemeDefault from '../../theme-default.js';

import {AccountActions} from '../actions/AccountActions.js';


export const styles = {
    loginContainer: {
        minWidth: 320,
        maxWidth: 400,
        height: 'auto',
        position: 'absolute',
        top: '20%',
        left: 0,
        right: 0,
        margin: 'auto'
    },
    paper: {
        padding: 20,
        overflow: 'auto'
    },
    buttonsDiv: {
        textAlign: 'center',
        padding: 10
    },
    flatButton: {
        color: grey500
    },
    loginBtn: {
        paddingTop: 10
    },
    btn: {
        background: '#4f81e9',
        color: white,
        padding: 7,
        borderRadius: 2,
        margin: 2,
        fontSize: 13
    },
    btnSpan: {
        marginLeft: 5
    },
};

@connect(state => state.AccountReducer, null, null, {pure: false})
export class Login extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            username: null,
            password: null
        };
    };

    static displayName = 'Login';

    static propTypes = {
        dispatch: PropTypes.func.isRequired
    };

    changeInput(key, value) {
        let newState = {};
        newState[key] = value;
        this.setState(newState);
    };

    handleSubmit() {
        const {username, password} = this.state;
        this.props.dispatch(AccountActions.login(username, password, this.props.location.query.next || '/'));
    };

    render() {
        const {username, password} = this.state,
              {errors, lock} = this.props;

        return (
            <MuiThemeProvider muiTheme={ThemeDefault}>
                <div style={styles.loginContainer}>
                    <Paper style={styles.paper}>
                        <form>
                            <TextField hintText="Username" floatingLabelText="Username" fullWidth={true}
                                       value={username || ''} disabled={lock} errorText={errors.username}
                                       onChange={e => this.changeInput('username', e.target.value)} />
                            <TextField hintText="Password" floatingLabelText="Password" fullWidth={true}
                                       type="password" value={password || ''} disabled={lock}
                                       errorText={errors.password || errors.non_field_errors}
                                       onChange={e => this.changeInput('password', e.target.value)} />
                            <RaisedButton label="Login" primary={true} fullWidth={true} style={styles.loginBtn}
                                          onClick={e => this.handleSubmit()} disabled={!username || !password || lock} />
                        </form>
                    </Paper>
                    <div style={styles.buttonsDiv}>
                        <Link to="/accounts/register/">
                            <FlatButton label="Register" style={styles.flatButton} icon={<PersonAdd />} />
                        </Link>
                        <FlatButton label="Forgot Password?" style={styles.flatButton} icon={<Help />} disabled={true} />
                    </div>
                </div>
            </MuiThemeProvider>
        );
    };
}

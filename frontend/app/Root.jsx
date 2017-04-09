import React, {PureComponent, Component, PropTypes, cloneElement} from 'react';
import {connect} from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {spacing, typography} from 'material-ui/styles';
import withWidth, {LARGE, SMALL} from 'material-ui/utils/withWidth';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import CommunicationChat from 'material-ui/svg-icons/communication/chat';
import Menu from 'material-ui/svg-icons/navigation/menu';
import {white, blue600, grey600} from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar';
import Drawer from 'material-ui/Drawer';
import {Link} from 'react-router';
import _ from 'lodash';

import ThemeDefault from './theme-default.js';

import {AccountActions} from './accounts/actions/AccountActions.js';
import {ChatActions} from './chat/actions/ChatActions.js';


@connect()
class Header extends PureComponent {
    static displayName = 'Header';

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        styles: PropTypes.object,
        handleChangeRequestNavDrawer: PropTypes.func
    };

    render() {
        const {styles, handleChangeRequestNavDrawer} = this.props;

        const style = {
            appBar: {
                position: 'fixed',
                top: 0,
                overflow: 'hidden',
                maxHeight: 57
            },
            menuButton: {
                marginLeft: 10
            },
            iconsRightContainer: {
                marginLeft: 20
            }
        };

        return (
            <AppBar style={{...styles, ...style.appBar}}
                    iconElementLeft={
                        <IconButton style={style.menuButton} onClick={handleChangeRequestNavDrawer}>
                            <Menu color={white} />
                        </IconButton>
                    }
                    iconElementRight={
                        <div style={style.iconsRightContainer}>
                            <IconMenu color={white}
                                      iconButtonElement={
                                          <IconButton><MoreVertIcon color={white}/></IconButton>
                                      }
                                      targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                      anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
                                <MenuItem primaryText="Sign out"
                                          onClick={() => this.props.dispatch(AccountActions.logout())}/>
                            </IconMenu>
                        </div>
                    } />
        );
    };
}

const styles = {
    logo: {
        cursor: 'pointer',
        fontSize: 22,
        color: typography.textFullWhite,
        lineHeight: `${spacing.desktopKeylineIncrement}px`,
        fontWeight: typography.fontWeightLight,
        backgroundColor: blue600,
        paddingLeft: 40,
        height: 56,
    },
    menuItem: {
        fontSize: 14
    },
    avatar: {
        div: {
            padding: '15px 0 20px 15px',
            height: 45
        },
        icon: {
            float: 'left',
            display: 'block',
            marginRight: 15,
            boxShadow: '0px 0px 0px 8px rgba(0,0,0,0.2)'
        },
        span: {
            display: 'block',
            color: 'white',
            fontWeight: 300,
            textShadow: '1px 1px #444'
        }
    }
};

@connect(state => ({
    ...state.AccountReducer,
    ...state.ChatReducer
}), null, null, {pure: false})
class LeftNav extends Component {
    static displayName = 'Left Navigation';

    static propTypes = {
        user: PropTypes.object.isRequired,
        navDrawerOpen: PropTypes.bool
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    getMenusData() {
        return _.map(this.props.rooms, room => ({
            id: room.id,
            text: room.name,
            room: room,
            icon: <CommunicationChat />,
        }));
    };

    render() {
        const {user, navDrawerOpen, activeRoom, changeActiveRoom} = this.props;

        return (
            <Drawer docked={true} open={navDrawerOpen}>
                <div style={styles.logo}>
                    Hit Chat
                </div>
                <div style={styles.avatar.div}>
                    <Avatar src="https://upload.wikimedia.org/wikipedia/commons/1/1e/Default-avatar.jpg" size={50}
                            style={styles.avatar.icon} />
                    <span style={styles.avatar.span}>{user.username}</span>
                </div>
                <div>
                    {_.map(this.getMenusData(), (menu, index) =>
                        <MenuItem key={index} style={_.merge(
                                        {},
                                        styles.menuItem,
                                        {color: activeRoom.id === menu.id ? white : grey600})
                                  } primaryText={menu.text} leftIcon={menu.icon}
                                  onTouchTap={() => changeActiveRoom(menu.room)} />
                    )}
                </div>
            </Drawer>
        );
    };
}

@connect(state => ({
    ...state.AccountReducer,
    ...state.ChatReducer
}), null, null, {pure: false})
@withWidth()
class Root extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            navDrawerOpen: true,
            activeRoom: {}
        };
    };

    static displayName = 'Root';

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        children: PropTypes.element,
        width: PropTypes.number
    };

    componentWillMount() {
        this.props.dispatch(ChatActions.list());

        if (this.props.width !== LARGE)
            this.setState({navDrawerOpen: false});
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.width !== nextProps.width)
            this.setState({navDrawerOpen: nextProps.width === LARGE});

        if (nextProps.rooms.length > 0 && !_.isEqual(nextProps.rooms, this.props.rooms))
            this.setState({activeRoom: nextProps.rooms[0]})
    };

    handleChangeRequestNavDrawer() {
        this.setState({navDrawerOpen: !this.state.navDrawerOpen});
    };

    render() {
        let {navDrawerOpen, activeRoom} = this.state;
        const paddingLeftDrawerOpen = 236;

        const styles = {
            header: {
                paddingLeft: navDrawerOpen ? paddingLeftDrawerOpen : 0
            },
            container: {
                margin: '80px 20px 20px 15px',
                paddingLeft: navDrawerOpen && this.props.width !== SMALL ? paddingLeftDrawerOpen : 0
            }
        };

        return (
            <MuiThemeProvider muiTheme={ThemeDefault}>
                <div>
                    <Header styles={styles.header} handleChangeRequestNavDrawer={::this.handleChangeRequestNavDrawer}/>
                    <LeftNav navDrawerOpen={navDrawerOpen} activeRoom={activeRoom}
                             changeActiveRoom={newRoom => this.setState({activeRoom: newRoom})} />
                    <div style={styles.container}>
                        {cloneElement(this.props.children, {
                            activeRoom: activeRoom
                        })}
                    </div>
                </div>
            </MuiThemeProvider>
        );
    };
}

export default Root;

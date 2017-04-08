import React, {PureComponent, Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {spacing, typography} from 'material-ui/styles';
import withWidth, {LARGE, SMALL} from 'material-ui/utils/withWidth';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import List from 'material-ui/svg-icons/action/list';
import FileFileUpload from 'material-ui/svg-icons/file/file-upload';
import Menu from 'material-ui/svg-icons/navigation/menu';
import {white, blue600} from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar';
import Drawer from 'material-ui/Drawer';
import {Link} from 'react-router';
import _ from 'lodash';

import ThemeDefault from './theme-default.js';
import {USER_TYPES, USER_TYPE_TEAM_CHIEF} from './accounts/Constants.js';

import {AccountActions} from './accounts/actions/AccountActions.js';


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
        color: white,
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
        const {user} = this.props;

        let data = [
            {
                text: 'List of Tasks',
                icon: <List />,
                link: '/',
                disabled: this.context.router.isActive('/') && !this.context.router.isActive('/upload/')
            }
        ];

        if (user.account_type === USER_TYPE_TEAM_CHIEF)
            data.push({
                text: 'Upload List',
                icon: <FileFileUpload />,
                link: '/upload/',
                disabled: this.context.router.isActive('/upload/')
            });

        return data;
    };

    render() {
        const {user, navDrawerOpen} = this.props;

        return (
            <Drawer docked={true} open={navDrawerOpen}>
                <div style={styles.logo}>
                    Team Manager
                </div>
                <div style={styles.avatar.div}>
                    <Avatar src="https://upload.wikimedia.org/wikipedia/commons/1/1e/Default-avatar.jpg" size={50}
                            style={styles.avatar.icon} />
                    <span style={styles.avatar.span}>{user.username}</span>
                    <span style={styles.avatar.span}>
                        {USER_TYPES[user.account_type]}
                    </span>
                </div>
                <div>
                    {_.map(this.getMenusData(), (menu, index) =>
                        <MenuItem key={index} style={styles.menuItem} primaryText={menu.text} disabled={menu.disabled}
                                  leftIcon={menu.icon} containerElement={<Link to={menu.link} />} />
                    )}
                </div>
            </Drawer>
        );
    };
}

@connect(state => state.AccountReducer)
@withWidth()
class Root extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            navDrawerOpen: true
        };
    };

    static displayName = 'Root';

    static propTypes = {
        children: PropTypes.element,
        width: PropTypes.number
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.width === nextProps.width) return;

        this.setState({navDrawerOpen: nextProps.width === LARGE});
    };

    handleChangeRequestNavDrawer() {
        this.setState({navDrawerOpen: !this.state.navDrawerOpen});
    };

    render() {
        let {navDrawerOpen} = this.state;
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
                    <LeftNav navDrawerOpen={navDrawerOpen} user={this.props.user} />
                    <div style={styles.container}>
                        {this.props.children}
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default Root;

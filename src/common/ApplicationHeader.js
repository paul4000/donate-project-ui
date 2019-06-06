import React, { Component } from 'react';
import {
    Link,
    withRouter
} from 'react-router-dom';

import { Layout, Menu, Dropdown, Icon } from 'antd';
import './ApplicationHeader.css';

const Header = Layout.Header;

class ApplicationHeader extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        let menuItems;
        if(this.props.currentUser) {
            console.log(this.props.currentUser);
            menuItems = [
                <Menu.Item key="/project">
                    <Link to={{ pathname: '/project', state: { currentUser : this.props.currentUser}}}>
                        <Icon type="project" className="nav-icon" />
                        PROJECTS
                    </Link>
                </Menu.Item>,
                <Menu.Item key="/logout" onClick={this.props.onLogout}>
                    LOGOUT
                </Menu.Item>

                //<Menu.Item key="/profile" className="profile-menu">

                //</Menu.Item>
            ];
        } else {
            console.log(this.props.currentUser);

            menuItems = [
                <Menu.Item key="/login">
                    <Link to="/login">LOGIN</Link>
                </Menu.Item>,
                <Menu.Item key="/register">
                    <Link to="/register">REGISTER</Link>
                </Menu.Item>
            ];
        }

        return (
            <Header className="app-header">
                <div className="app-container">
                    {/*<div className="app-title" >*/}
                        {/*<Link to="/">Donate project</Link>*/}
                    {/*</div>*/}
                    <Menu
                        className="app-menu"
                        mode="horizontal"
                        selectedKeys={[this.props.location.pathname]}
                        style={{ lineHeight: '64px' }} >
                        {menuItems}
                    </Menu>
                </div>
            </Header>
        );
    }
}
export default withRouter(ApplicationHeader);
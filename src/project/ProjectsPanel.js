import React, {Component} from 'react';
import { Layout, Menu, Dropdown, Icon } from 'antd';
import {
    Link,
    withRouter
} from 'react-router-dom';
const Header = Layout.Header;



class ProjectsPanel extends Component {

    constructor(props) {
        super(props);
    }

    render(){
        let menuItems;
        if(this.props.currentUser.authorities[0].authority === "ROLE_INITIATOR") {
            menuItems = [
                <Menu.Item key="/project/my/list">
                    {/*<Link to="/project/submission">*/}
                        <Icon type="copy" className="nav-icon" />
                        MY PROJECTS
                    {/*</Link>*/}
                </Menu.Item>,
                <Menu.Item key="/project/submission">
                    <Link to="/project/submission">
                        <Icon type="plus" className="nav-icon" />
                        ADD PROJECT
                    </Link>
                </Menu.Item>
            ];
        } else {
            menuItems = [
                <Menu.Item key="/project/all">
                    {/*<Link to="/project/submission">*/}
                    <Icon type="folder-open" className="nav-icon" />
                    ALL PROJECTS
                    {/*</Link>*/}
                </Menu.Item>,
                <Menu.Item key="/project/donated">
                    {/*<Link to="/project/donated">*/}
                        <Icon type="check-square" className="nav-icon" />
                        DONATED PROJECTS
                    {/*</Link>*/}
                </Menu.Item>
            ];
        }
        return (
            <Header className="sub-app-header">
                <div className="container">
                    {/*<div className="app-title" >*/}
                    {/*<Link to="/">Donate project</Link>*/}
                    {/*</div>*/}
                    <Menu
                        className="app-menu"
                        mode="horizontal"
                        selectedKeys={[this.props.location.pathname]}
                        style={{ lineHeight: '40px', height: '15px', fontSize: "10px" }} >
                        {menuItems}
                    </Menu>
                </div>
            </Header>
        );

    }
}
export default withRouter(ProjectsPanel);
import React, {Component} from 'react';
import {Icon, Layout, Menu} from 'antd';
import {Link, Route, withRouter} from 'react-router-dom';
import Submission from "./Submission";

const Header = Layout.Header;


class ProjectsPanel extends Component {

    render() {
        let menuItems;
        if (this.props.currentUser.authorities[0].authority === "ROLE_INITIATOR") {
            menuItems = [
                <Menu.Item key="/project/my/list">
                    {/*<Link to="/project/submission">*/}
                    <Icon type="copy" className="nav-icon"/>
                    MY PROJECTS
                    {/*</Link>*/}
                </Menu.Item>,
                <Menu.Item key="/project/submission">
                    <Link to="/project/submission">
                        <Icon type="plus" className="nav-icon"/>
                        ADD PROJECT
                    </Link>
                </Menu.Item>
            ];
        } else {
            menuItems = [
                <Menu.Item key="/project/all">
                    {/*<Link to="/project/submission">*/}
                    <Icon type="folder-open" className="nav-icon"/>
                    ALL PROJECTS
                    {/*</Link>*/}
                </Menu.Item>,
                <Menu.Item key="/project/donated">
                    {/*<Link to="/project/donated">*/}
                    <Icon type="check-square" className="nav-icon"/>
                    DONATED PROJECTS
                    {/*</Link>*/}
                </Menu.Item>
            ];
        }
        return (
            <Layout>
                <Header className="app-header">
                    <div className="app-container">
                        <Menu
                            className="ant-menu app-menu"
                            mode="horizontal"
                            selectedKeys={[this.props.location.pathname]}
                            style={{lineHeight: '40px', fontSize: "12px", background: '#fff',
                                marginBottom: '10px'}}>
                            {menuItems}
                        </Menu>
                    </div>
                    <Route path="/project/submission" render={(props) => <Submission {...props} />}/>
                </Header>
            </Layout>
        );

    }

    constructor(props) {
        super(props);
    }
}

export default withRouter(ProjectsPanel);
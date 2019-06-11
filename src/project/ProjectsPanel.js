import React, {Component} from 'react';
import {Icon, Layout, Menu} from 'antd';
import {Link, Route, withRouter} from 'react-router-dom';
import Submission from "./Submission";
import MyProjectsList from "./list/MyProjectsList";
import AllProjectsList from "./list/AllProjectsList";
import DonatedProjectsList from "./list/DonatedProjectsList";
import Project from "./Project";

import { currentUser } from "../common/RequestsHelper";

const Header = Layout.Header;


class ProjectsPanel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentUser : null
        }

    }

    componentDidMount() {

        currentUser()
            .then(response => {
                    this.setState({
                        currentUser: response
                    });
                }
            ).catch(error => {
            console.log(error);
        })
    }

    render() {
        let menuItems;
        if (this.state.currentUser && this.state.currentUser.authorities[0].authority === "ROLE_INITIATOR") {
            menuItems = [
                <Menu.Item key="/project/my/list">
                    <Link to="/project/my/list">
                    <Icon type="copy" className="nav-icon"/>
                    MY PROJECTS
                    </Link>
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
                    <Link to="/project/all">
                    <Icon type="folder-open" className="nav-icon"/>
                    ALL PROJECTS
                    </Link>
                </Menu.Item>,
                <Menu.Item key="/project/donated">
                    <Link to="/project/donated">
                    <Icon type="check-square" className="nav-icon"/>
                    DONATED PROJECTS
                    </Link>
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
                    <Route path="/project/my/list" render={(props) => <MyProjectsList {...props} />}/>
                    <Route path="/project/all" render={(props) => <AllProjectsList {...props} />}/>
                    <Route path="/project/donated" render={(props) => <DonatedProjectsList {...props} />}/>
                    <Route path="/project/details/:projectId" render={(props) => <Project {...props} />}/>
                </Header>
            </Layout>
        );

    }
}

export default withRouter(ProjectsPanel);
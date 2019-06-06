import React, {Component} from 'react';
import './App.css';
import Register from './user/Register'
import Login from './user/Login'
import ProjectsPanel from './project/ProjectsPanel'
import { Layout, notification} from 'antd';
import {currentUser} from './common/RequestsHelper';
import ApplicationHeader from './common/ApplicationHeader';
import { Route, Switch, withRouter} from 'react-router-dom';
import {ACCESS_TOKEN} from './storage';
const {Content} = Layout;

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            isAuthenticated: false
        };

        this.fillCurrentUser = this.fillCurrentUser.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.logout = this.logout.bind(this);
    }

    fillCurrentUser() {
        currentUser()
            .then(response => {
                    this.setState({
                        currentUser: response,
                        isAuthenticated: true
                    });
                    console.log("Successfully logged in ");
                    console.log(this.state);
                }
            ).catch(error => {
            console.log(error);
        })
    }

    handleLogin() {

        notification.success({
            message: 'Logging in Donate App',
            description : "You are successfully logged in"
        });

        this.fillCurrentUser();
        this.props.history.push("/");
    }

    logout() {
        localStorage.removeItem(ACCESS_TOKEN);
        this.setState({
            currentUser: null,
            isAuthenticated: false
        });

        notification.success({
            message: 'Logging in Donate App',
            description : "You are successfully logged out"
        });

        this.props.history.push("/");

    }

    componentDidMount() {
        this.fillCurrentUser();
    }

    render() {
        return (
            <Layout>
                <div className="App">
                    <ApplicationHeader currentUser={this.state.currentUser} onLogout={this.logout}/>
                    <Content className="app-content">
                        <div className="container">
                            <Switch>
                                <Route exact path="/">
                                    <div className="container">
                                    </div>
                                </Route>
                                <Route path="/register" render={(props) => <Register onLogin={this.handleLogin} {...props} />}/>
                                <Route path="/login" render={(props) => <Login onLogin={this.handleLogin} {...props} />}/>
                                <Route path="/project" render={(props) => <ProjectsPanel currentUser={this.state.currentUser} {...props} />}/>
                            </Switch>
                        </div>
                    </Content>
                </div>
            </Layout>
        );
    }
}

export default withRouter(App);

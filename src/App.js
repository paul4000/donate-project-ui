import React, {Component} from 'react';
import './App.css';
import Register from './user/Register'
import Login from './user/Login'
import ProjectsPanel from './project/ProjectsPanel'
import Submission from './project/Submission'
import {Button, Layout, notification} from 'antd';
import {currentUser} from './common/RequestsHelper';
import ApplicationHeader from './common/ApplicationHeader';
import {Link, Route, Switch, withRouter} from 'react-router-dom';
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

        // this.fillCurrentUser();
        this.props.history.push("/");
        console.log(this.state);
    }

    componentDidMount() {
        this.fillCurrentUser();
    }

    render() {
        return (
            <Layout>
                <div className="App">
                    <ApplicationHeader currentUser={this.state.currentUser}/>
                    <Content className="app-content">
                        <div className="container">
                            <Switch>
                                <Route exact path="/">
                                    <div className="container">
                                    </div>
                                </Route>
                                <Route path="/register" render={(props) => <Register onLogin={this.handleLogin} {...props} />}/>
                                <Route path="/login" render={(props) => <Login onLogin={this.handleLogin} {...props} />}/>
                                {/*<Route path="/project/submission" component={Submission} />*/}
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

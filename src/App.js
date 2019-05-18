import React, {Component} from 'react';
import './App.css';
import Register from './user/Register'
import Login from './user/Login'
import Submission from './project/Submission'
import {Button, Layout, notification} from 'antd';
import {currentUser} from './common/RequestsHelper';
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
            <div className="App">
                <Content className="app-content">
                    <div className="container">
                        <Switch>
                            <Route exact path="/">
                                <div className="container">
                                    <Button type="primary" htmlType="submit" size="large" className="ant-btn-round">
                                        <Link to="/register"> REGISTER </Link>
                                    </Button>
                                    <Button type="primary" htmlType="submit" size="large" className="ant-btn-round">
                                        <Link to="/login"> LOGIN </Link>
                                    </Button>
                                </div>
                            </Route>
                            <Route path="/register" component={Register}/>
                            <Route path="/login" render={(props) => <Login onLogin={this.handleLogin} {...props} />}/>
                            <Route path="/project" component={Submission}/>
                        </Switch>
                    </div>
                </Content>
            </div>
        );
    }
}

export default withRouter(App);

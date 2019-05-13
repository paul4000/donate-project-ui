import React, { Component } from 'react';
import './App.css';
import Register  from './user/Register'
import Login  from './user/Login'

import {
  Route,
  withRouter,
  Switch, Link
} from 'react-router-dom';

import { Layout, notification } from 'antd';
import Button from "antd/lib/button";
const { Content } = Layout;

class App extends Component {
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
                <Route path="/login" component={Login}/>
              </Switch>
            </div>
        </Content>
      </div>
    );
  }
}

export default withRouter(App);

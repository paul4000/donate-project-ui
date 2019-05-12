import React, { Component } from 'react';
import './App.css';
import Register  from './user/Register'
import Login  from './user/Login'

import {
  Route,
  withRouter,
  Switch
} from 'react-router-dom';

import { Layout, notification } from 'antd';
const { Content } = Layout;

class App extends Component {
  render() {
    return (
      <div className="App">
        <Content className="app-content">
            <div className="container">
              <Switch>
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

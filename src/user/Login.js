import React, {Component} from 'react';
import './Register.css';
import {Button, Form, Input, Row, notification} from "antd";
import {loginUser} from '../common/RequestsHelper';
import { ACCESS_TOKEN } from '../storage';

const FormItem = Form.Item;

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };

        this.changeField = this.changeField.bind(this);
        this.submit = this.submit.bind(this);
    }

    changeField(event) {
        const target = event.target;
        const fieldName = target.name;
        const fieldValue = target.value;

        this.setState({
            [fieldName]: fieldValue
        })
    }

    submit(e) {
        e.preventDefault();

        console.log("Logging");

        const reqData = Object.assign({}, this.state);

        loginUser(reqData)
            .then(response => {

                localStorage.setItem(ACCESS_TOKEN, response.token);

                this.props.onLogin();
            }).catch(error => {
                console.log(error);
                if(error.status === 401) {
                    notification.error({
                        message: 'Donate App',
                        description: 'Your logging data are incorrect'
                    });
                } else {
                    notification.error({
                        message: 'Donate App',
                        description: error.message || 'Error occurred'
                    });
                }
        })
    }

    render() {
        return (
            <div className="login-container">
                <h3 className="page-title">Login in app</h3>
                <Row className="login-content" type="flex" justify="center" align="middle">
                    <Form className="login-form" onSubmit={this.submit}>
                        <FormItem label="Username">
                            <Input size="large" name="username" placeholder="Type your username"
                                   value={this.state.username}
                                   onChange={(event) => this.changeField(event)}/>
                        </FormItem>
                        <FormItem label="Password">
                            <Input size="large" name="password" type="password" placeholder="Type your password"
                                   value={this.state.password}
                                   onChange={(event) => this.changeField(event)}/>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" size="large" className="login-button">
                                Login.
                            </Button>
                        </FormItem>
                    </Form>
                </Row>
            </div>
        );
    }
}

export default Login;
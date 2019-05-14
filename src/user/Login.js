import React, {Component} from 'react';
import './Register.css';
import {Button, Form, Input, Select} from "antd";

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

    submit(){
        //here API call
        console.log("Login");
    }

    render() {
        return (
            <div className="login-container">
                <h3 className="page-title">Register in app</h3>
                <div className="login-content">
                    <Form className="login-form" onSubmit={this.submit}>
                        <FormItem label="Username">
                            <Input size="medium" name="username" placeholder="Type your username" className="ant-input-disabled"
                                   value={this.state.username}
                                   onChange={(event) => this.changeField(event)}/>
                        </FormItem>
                        <FormItem label="Password">
                            <Input size="medium" name="password" placeholder="Type your password"
                                   value={this.state.password}
                                   onChange={(event) => this.changeField(event)}/>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" size="large" className="login-button">
                                Login.
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

export default Login;
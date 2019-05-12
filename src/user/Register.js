import React, {Component} from 'react';
import './Register.css';
import {Button, Form, Input, Select} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            username: '',
            password: '',
            email: '',
            passwordConfirmation: '',
            passwordToAccount: '',
            passwordToAccountConfirm: '',
            accountRole: ''
        };

        this.checkIfEmailCorrect = this.checkIfEmailCorrect.bind(this);
        this.checkIfPasswordsMatch = this.checkIfPasswordsMatch.bind(this);
        this.submit = this.submit.bind(this);
        this.changeField = this.changeField.bind(this);
        this.changeAccountRole = this.changeAccountRole.bind(this);
    }

    checkIfEmailCorrect = (email) => {
        const emailRegex = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');

        if (emailRegex.test(email)) {
            return {
                result: 'success',
                msg: 'Email is correct'
            }
        } else {
            return {
                result: 'error',
                msg: 'Email not correct'
            }
        }
    };

    checkIfPasswordsMatch = (password, passwordConfirmation) => {

        if (password === passwordConfirmation) {
            return 'success'
        } else {
            return 'error'
        }
    };

    submit() {
        //here API call
        console.log("Here registering user!")
    }

    changeField(event) {
        const target = event.target;
        const fieldName = target.name;
        const fieldValue = target.value;

        this.setState({
            [fieldName]: fieldValue
        })
    }

    changeAccountRole(newAccountRole) {
        this.setState({
            accountRole : newAccountRole
        })
    }

    render() {
        return (
            <div className="register-container">
                <h3 className="page-title">Register in app</h3>
                <div className="register-content">
                    <Form className="register-form" onSubmit={this.submit}>
                        <FormItem label="Name">
                            <Input size="large" name="name" placeholder="Type your name" value={this.state.name}
                                   onChange={(event) => this.changeField(event)}/>
                        </FormItem>
                        <FormItem label="Username">
                            <Input size="large" name="username" placeholder="Type your username"
                                   value={this.state.username}
                                   onChange={(event) => this.changeField(event)}/>
                        </FormItem>
                        <FormItem label="Email">
                            <Input size="large" name="email" placeholder="Type your email"
                                   value={this.state.email}
                                   onChange={(event) => this.changeField(event)}/>
                        </FormItem>
                        <FormItem label="Password">
                            <Input size="large" name="password" placeholder="Type your password"
                                   value={this.state.password}
                                   onChange={(event) => this.changeField(event)}/>
                        </FormItem>
                        <FormItem label="Password confirmation">
                            <Input size="large" name="passwordConfirmation" placeholder="Type your password again"
                                   value={this.state.passwordConfirmation}
                                   onChange={(event) => this.changeField(event)}/>
                        </FormItem>
                        <FormItem label="Password for ethereum wallet">
                            <Input size="large" name="passwordToAccount" placeholder="Type your password"
                                   value={this.state.passwordToAccount}
                                   onChange={(event) => this.changeField(event)}/>
                        </FormItem>
                        <FormItem label="Password confirmation">
                            <Input size="large" name="passwordToAccountConfirm" placeholder="Type your password again"
                                   value={this.state.passwordToAccountConfirm}
                                   onChange={(event) => this.changeField(event)}/>
                        </FormItem>
                        <FormItem label="Role of your account">
                            <Select name="accountRole" defaultValue="DONATOR"
                                    onChange={ this.changeAccountRole }>
                                <Option value="DONATOR">DONATOR</Option>
                                <Option value="INITIATOR">INITIATOR</Option>
                                <Option value="EXECUTOR">EXECUTOR</Option>
                            </Select>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" size="large" className="register-button">
                                Register.
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

export default Register;
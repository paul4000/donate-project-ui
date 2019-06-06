import React, {Component} from 'react';
import './Register.css';
import {Button, Form, Input, notification, Row, Select} from 'antd';
import {registerUser} from '../common/RequestsHelper';
import {ACCESS_TOKEN} from "../storage";

const FormItem = Form.Item;
const Option = Select.Option;

class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: {
                value: ''
            },
            username: {
                value: ''
            },
            password: {
                value: ''
            },
            email: {
                value: ''
            },
            passwordConfirmation: {
                value: ''
            },
            passwordToAccount: {
                value: ''
            },
            passwordToAccountConfirm: {
                value: ''
            },
            accountRole: 'DONATOR'
        };

        this.checkIfEmailCorrect = this.checkIfEmailCorrect.bind(this);
        this.checkIfPasswordsMatch = this.checkIfPasswordsMatch.bind(this);
        this.checkIfNotEmpty = this.checkIfNotEmpty.bind(this);
        this.checkIfPasswordsToAccountMatch = this.checkIfPasswordsToAccountMatch.bind(this);
        this.submit = this.submit.bind(this);
        this.changeField = this.changeField.bind(this);
        this.changeAccountRole = this.changeAccountRole.bind(this);
        this.cannotSubmit = this.cannotSubmit.bind(this);
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

    checkIfPasswordsMatch = (password) => {

        if (password === this.state.password.value) {
            return {
                result: 'success'
            }
        } else {
            return {
                result: 'error',
                msg: 'Passwords do not match'
            }
        }
    };
    checkIfPasswordsToAccountMatch = (password) => {

        if (password === this.state.passwordToAccount.value) {
            return {
                result: 'success'
            }
        } else {
            return {
                result: 'error',
                msg: 'Passwords do not match'
            }
        }
    };

    checkIfNotEmpty = (field) => {
        if (field.length > 0) {
            return {
                result: 'success'
            }
        } else {
            return {
                result: 'error',
                msg: 'Should not be empty'
            }
        }
    };

    submit() {
        const rq = {
            name: this.state.name.value,
            username: this.state.username.value,
            password: this.state.password.value,
            email: this.state.email.value,
            passwordConfirmation: this.state.passwordConfirmation.value,
            passwordToAccount: this.state.passwordToAccount.value,
            passwordToAccountConfirm: this.state.passwordToAccountConfirm.value,
            accountRole: this.state.accountRole
        };

        console.log(rq);

        registerUser(rq)
            .then(response => {
                console.log(response);
                localStorage.setItem(ACCESS_TOKEN, response.token);
                this.props.onLogin();
            }).catch(error => {
            notification.error({
                message: 'Donate App',
                description: error.message || 'Error occurred'
            });
        });
    }

    changeField(event, validateFunction) {
        const target = event.target;
        const fieldName = target.name;
        const fieldValue = target.value;

        this.setState({
            [fieldName]: {
                value: fieldValue,
                ...validateFunction(fieldValue)
            }
        })
    }

    changeAccountRole(newAccountRole) {
        this.setState({
            accountRole: newAccountRole
        })
    }

    cannotSubmit() {
        return !(this.state.name.result === 'success' &&
            this.state.username.result === 'success' &&
            this.state.password.result === 'success'&&
            this.state.email.result === 'success' &&
            this.state.passwordConfirmation.result === 'success' &&
            this.state.passwordToAccount.result === 'success' &&
            this.state.passwordToAccountConfirm.result === 'success')
    }

    render() {
        return (
            <div className="register-container">
                <h3 className="page-title">Register in app</h3>
                <Row className="register-content" type="flex" justify="center" align="middle">
                    <Form className="register-form" onSubmit={this.submit}>
                        <FormItem label="Name" validateStatus={this.state.name.result}
                                  help={this.state.name.msg}>
                            <Input size="large" name="name" placeholder="Type your name" value={this.state.name.value}
                                   onChange={(event) => this.changeField(event, this.checkIfNotEmpty)}/>
                        </FormItem>
                        <FormItem label="Username"  validateStatus={this.state.username.result}
                                  help={this.state.username.msg}>
                            <Input size="large" name="username" placeholder="Type your username"
                                   value={this.state.username.value}
                                   onChange={(event) => this.changeField(event, this.checkIfNotEmpty)}/>
                        </FormItem>
                        <FormItem label="Email"
                                  validateStatus={this.state.email.result}
                                  help={this.state.email.msg}>
                            <Input size="large" name="email" placeholder="Type your email"
                                   value={this.state.email.value}
                                   onChange={(event) => this.changeField(event, this.checkIfEmailCorrect)}/>
                        </FormItem>
                        <FormItem label="Password" validateStatus={this.state.password.result}
                                  help={this.state.password.msg}>
                            <Input size="large" type ="password" name="password" placeholder="Type your password"
                                   value={this.state.password.value}
                                   onChange={(event) => this.changeField(event, this.checkIfNotEmpty)}/>
                        </FormItem>
                        <FormItem label="Password confirmation" validateStatus={this.state.passwordConfirmation.result}
                                  help={this.state.passwordConfirmation.msg}>
                            <Input size="large" type ="password" name="passwordConfirmation" placeholder="Type your password again"
                                   value={this.state.passwordConfirmation.value}
                                   onChange={(event) => this.changeField(event, this.checkIfPasswordsMatch)}/>
                        </FormItem>
                        <FormItem label="Password for ethereum wallet (please do not forget as it is unrecoverable)" validateStatus={this.state.passwordToAccount.result}
                                  help={this.state.passwordToAccount.msg}>
                            <Input size="large" type ="password" name="passwordToAccount" placeholder="Type your password"
                                   value={this.state.passwordToAccount.value}
                                   onChange={(event) => this.changeField(event, this.checkIfNotEmpty)}/>
                        </FormItem>
                        <FormItem label="Password confirmation" validateStatus={this.state.passwordToAccountConfirm.result}
                                  help={this.state.passwordToAccountConfirm.msg}>
                            <Input size="large" type ="password" name="passwordToAccountConfirm" placeholder="Type your password again"
                                   value={this.state.passwordToAccountConfirm.value}
                                   onChange={(event) => this.changeField(event, this.checkIfPasswordsToAccountMatch)}/>
                        </FormItem>
                        <FormItem label="Role of your account">
                            <Select name="accountRole" defaultValue="DONATOR"
                                    onChange={this.changeAccountRole}>
                                <Option value="DONATOR">DONATOR</Option>
                                <Option value="INITIATOR">INITIATOR</Option>
                                <Option value="EXECUTOR">EXECUTOR</Option>
                            </Select>
                        </FormItem>
                        <FormItem>
                            <Button disabled={this.cannotSubmit()} type="primary" htmlType="submit" size="large" className="register-button">
                                Register.
                            </Button>
                        </FormItem>
                    </Form>
                </Row>
            </div>
        );
    }
}

export default Register;
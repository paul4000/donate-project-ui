import React, {Component} from 'react';
import {currentUser, downloadProjectDetails, getProject, openProject} from "../common/RequestsHelper";
import {Button, Col, Input, Layout, notification, Row} from 'antd';

import './Project.css';
import {WALLET_PASSWORD} from "../storage";
import FormItem from "antd/es/form/FormItem";

const {Content} = Layout;

class Project extends Component {

    constructor(props) {
        super(props);
        this.state = {
            project: {},
            currentUser: {},
            walletPass: '',
            goalAmount: '',
            projectAddress: '',
            savedPass: '',
            amountOfDonation: {
                value: 0
            }
        };

        this.downloadProject = this.downloadProject.bind(this);
        this.openProject = this.openProject.bind(this);
        this.donateProject = this.donateProject.bind(this);
        this.getProperOptions = this.getProperOptions.bind(this);
        this.closeProject = this.closeProject.bind(this);
        this.setWallPass = this.setWallPass.bind(this);
        this.changeField = this.changeField.bind(this);
    }

    componentDidMount() {

        const pass = localStorage.getItem(WALLET_PASSWORD);

        console.log(pass);
        if (pass) {
            console.log("Password saved");

            this.setState({
                savedPass: pass
            })
        }

        currentUser()
            .then(response => {
                    this.setState({
                        currentUser: response
                    });
                }
            ).catch(error => {
            console.log(error);
        });

        const projectId = parseInt(this.props.match.params.projectId);
        console.log(this.props);

        getProject(projectId)
            .then(response => {
                this.setState({
                    project: response
                });

            }).catch(error => {
            console.log(error);
        });

        console.log(this.state);
    }

    downloadProject(event) {
        event.preventDefault();

        downloadProjectDetails(this.state.project.id)
            .then(response => {
                const projectFileName = response.headers.get('Content-Disposition').split('filename=')[1];
                response.blob().then(blob => {
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = projectFileName;
                    a.click();
                });

            }).catch(error => {
            console.log(error);
            notification.error({
                message: 'Donate App',
                description: 'Problem with downloading project'
            });
        })
    }

    openProject(event) {
        event.preventDefault();

        const rq = {
            passwordToWallet: this.state.walletPass,
            projectId: this.state.project.id,
            amount: this.state.goalAmount
        };

        console.log(rq);

        openProject(rq)
            .then(response => {
                notification.success({
                    message: 'Donate App',
                    description: 'Project opened, can be donated now'
                });

                this.setWallPass();
                window.location.reload();

            }).catch(error => {
            notification.error({
                message: 'Donate App',
                description: error.message || 'Unidentified error'
            });
        })
    }

    closeProject(event) {
        event.preventDefault();

        const rq = {}

    }

    donateProject(event) {
        event.preventDefault();
    }



    changeField(event) {
        const target = event.target;
        const fieldName = target.name;
        const fieldValue = target.value;

        this.setState({
            [fieldName]: fieldValue
        })
    }


    getProperOptions() {
        if (this.state.project.isOpened) {
            if (this.state.currentUser.authorities[0].authority === "ROLE_INITIATOR") {
                return (
                    <Button icon="play-circle" type="primary" size="large" onClick={this.closeProject}>
                        CLOSE
                    </Button>
                )
            } else {
                return (
                    <div>
                        <FormItem label="Submit amount of ether which you want donate">
                            <Input size="large" name="amountOfDonation"
                                   placeholder="Type amount" value={this.state.amountOfDonation}
                                   onChange={(event) => this.changeField(event)}/>
                        </FormItem>
                        <Button icon="play-circle" type="primary" size="large" onClick={this.donateProject}>
                            DONATE
                        </Button>
                    </div>
                )
            }
        } else {
            return (
                <div>
                    <Button style={{marginBottom: '10px'}} icon="play-circle" type="primary" size="large"
                            onClick={this.openProject}>
                        OPEN
                    </Button>
                    <Input size="large" name="goalAmount" type="text" placeholder="Type goal amount"
                           value={this.state.goalAmount} onChange={(event) => this.changeField(event)}/>
                </div>
            )

        }
    }

    setWallPass(pass) {
        localStorage.setItem(WALLET_PASSWORD, pass);
    }

    render() {
        return (
            <Layout>
                <div className="project-container">
                    <Content>
                        <h3>{this.state.project.name}</h3>
                        <p>{this.state.projectAddress}</p>

                        <div>
                            {this.state.project.summary}
                        </div>

                        <Row>
                            <Col>
                                <div className="download-project-container">
                                    <Button icon="download" type="primary" size="large" onClick={this.downloadProject}>
                                        Download details
                                    </Button>
                                </div>
                            </Col>
                        </Row>

                        <Row className="options-container">
                            <Col span={8}>

                            </Col>
                            <Col span={8}>
                                <div className="project-options">
                                    {this.getProperOptions()}
                                </div>
                            </Col>
                            <Col span={8}>
                                {this.state.savedPass.length > 0 ?
                                    <FormItem label="Submit your ethereum password, after first use will be remembered">
                                        <Input size="large" name="walletPass" type="password"
                                               placeholder="Type your wallet password" value={this.state.walletPass}
                                               onChange={(event) => this.changeField(event)}/>
                                    </FormItem> :
                                    null}
                            </Col>
                        </Row>


                    </Content>
                </div>
            </Layout>
        );
    }
}

export default Project;
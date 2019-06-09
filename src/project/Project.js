import React, {Component} from 'react';
import {currentUser, donateProject, downloadProjectDetails, getProject, openProject} from "../common/RequestsHelper";
import {Avatar, Button, Card, Col, Icon, Input, Layout, notification, Row} from 'antd';
import AddExecutorsComponent from './AddExecutorsComponent';
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
            amountOfDonation: 0.0,
            processing: false
        };

        this.downloadProject = this.downloadProject.bind(this);
        this.openProject = this.openProject.bind(this);
        this.donateProject = this.donateProject.bind(this);
        this.getProperOptions = this.getProperOptions.bind(this);
        this.closeProject = this.closeProject.bind(this);
        this.setWallPass = this.setWallPass.bind(this);
        this.changeField = this.changeField.bind(this);
        this.getProperAvatar = this.getProperAvatar.bind(this);
    }

    componentDidMount() {

        const pass = localStorage.getItem(WALLET_PASSWORD);

        console.log(pass);
        if (pass) {
            console.log("Password saved");

            this.setState({
                savedPass: pass,
                walletPass: pass
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

                console.log(response);

            }).catch(error => {
            console.log(error);
        });
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

        this.setState({
            processing: true
        });

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
            this.setState({
                processing: false
            });

        })
    }

    closeProject(event) {
        event.preventDefault();

        const rq = {}

    }

    donateProject(event) {
        event.preventDefault();

        const id = parseInt(this.props.match.params.projectId);

        const rq = {
            projectId: id,
            amountOfDonation: this.state.amountOfDonation,
            passToWallet: this.state.walletPass
        };

        console.log(rq);


        this.setState({
            processing: true
        });
        donateProject(rq)
            .then(response => {
                notification.success({
                    message: 'Donate App',
                    description: 'Project donated!'
                });

                this.setWallPass(this.state.walletPass);
                window.location.reload();

            }).catch(error => {
            notification.error({
                message: 'Donate App',
                description: 'Project donation went wrong!'
            });
            this.setState({
                processing: false
            });
        });

    }


    changeField(event) {
        const target = event.target;
        const fieldName = target.name;
        const fieldValue = target.value;

        this.setState({
            [fieldName]: fieldValue
        })
    }

    getProperAvatar() {
        if (this.state.project.opened) {
            return <Avatar size="large" icon="unlock" style={{backgroundColor: '#04B404'}}/>
        }

        if (this.state.project.validationPhase) {
            return <Avatar size="large" icon="unlock" style={{backgroundColor: '#FACC2E'}}/>
        }

        if (this.state.project.ifProjectSuccessful) {
            return <Avatar size="large" icon="check" style={{backgroundColor: '#04B404'}}/>
        }

        if (!this.state.project.isOpened && this.state.project.ifProjectSuccessful === null) {
            return <Avatar size="large" icon="lock"/>
        }

        if (!this.state.project.ifProjectSuccessful) {
            return <Avatar size="large" icon="check" style={{backgroundColor: '#FFBF00'}}/>
        }
    }


    getProperOptions() {
        if (this.state.project.opened) {
            if (this.state.currentUser.authorities[0].authority === "ROLE_INITIATOR") {
                return (
                    <Col span={16}>
                        <AddExecutorsComponent amountOfDonation={this.state.amountOfDonation}/>
                    </Col>
                )
            } else {
                return (
                    <div>
                        <Col span={8}>

                        </Col>
                        <Col span={8}>
                            <FormItem label="Submit amount of ether which you want donate">
                                <Input size="large" name="amountOfDonation"
                                       placeholder="Type amount" value={this.state.amountOfDonation}
                                       onChange={(event) => this.changeField(event)}/>
                            </FormItem>
                            <Button icon="play-circle" type="primary" size="large" onClick={this.donateProject}>
                                DONATE
                            </Button>
                        </Col>
                    </div>
                )
            }
        } else {
            return (
                <div>
                    <Col span={8}>

                    </Col>
                    <Col span={8}>
                        <Button style={{marginBottom: '10px'}} icon="play-circle" type="primary" size="large"
                                onClick={this.openProject}>
                            OPEN
                        </Button>
                        <Input size="large" name="goalAmount" type="text" placeholder="Type goal amount"
                               value={this.state.goalAmount} onChange={(event) => this.changeField(event)}/>
                    </Col>
                </div>
            )

        }
    }

    setWallPass(pass) {
        localStorage.setItem(WALLET_PASSWORD, pass);
    }

    render() {

        let projectDetails;

        if (this.state.project.opened) {
            projectDetails = (
                <Row>
                    <Col span={16}>
                        {this.state.project.summary}
                    </Col>
                    <Col span={8}>
                        <div className="balance-project-container">
                            <Card title={"Goal amount: " + parseFloat(this.state.project.goalAmount) + " eth"}
                                  bordered={true}>
                                {"Donation: " + parseFloat(this.state.project.actualBalance) + " eth"}
                            </Card>
                        </div>
                    </Col>
                </Row>
            )
        } else {
            projectDetails = (
                <Row>
                    <Col>
                        {this.state.project.summary}
                    </Col>
                </Row>
            )
        }

        let processingIcon;
        if (this.state.processing) {
            processingIcon = (
                <Icon type="sync" spin/>
            )
        }

        return (
            <Layout>
                <div className="project-container">
                    <Content>
                        <h3>
                            {this.getProperAvatar()} &nbsp; &nbsp;&nbsp;
                            {this.state.project.name} &nbsp;
                            {processingIcon}
                        </h3>
                        <p>{this.state.projectAddress}</p>

                        {projectDetails}

                        <Col>
                            <div className="download-project-container">
                                <Button icon="download" type="primary" size="large" onClick={this.downloadProject}>
                                    Download details
                                </Button>
                            </div>
                        </Col>

                        <Row className="options-container">

                            <div className="project-options">
                                {this.getProperOptions()}
                            </div>

                            <Col span={8}>
                                {this.state.savedPass.length < 1 ?
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
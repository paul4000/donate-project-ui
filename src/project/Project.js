import React, {Component} from 'react';
import {
    addExecutors,
    closeAndExecute,
    currentUser,
    donateProject,
    downloadProjectDetails,
    getExecutors,
    getProject,
    openProject,
    voteForExecution
} from "../common/RequestsHelper";
import {Avatar, Button, Card, Col, Icon, Input, Layout, List, notification, Progress, Row} from 'antd';
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
            detailsLoaded: false,
            processing: false,
            executorsList: []
        };

        this.downloadProject = this.downloadProject.bind(this);
        this.openProject = this.openProject.bind(this);
        this.donateProject = this.donateProject.bind(this);
        this.getProperOptions = this.getProperOptions.bind(this);
        this.closeProject = this.closeProject.bind(this);
        this.setWallPass = this.setWallPass.bind(this);
        this.changeField = this.changeField.bind(this);
        this.getProperAvatar = this.getProperAvatar.bind(this);
        this.handleSubmitExecutors = this.handleSubmitExecutors.bind(this);
        this.cannotDonate = this.cannotDonate.bind(this);
        this.voteForProject = this.voteForProject.bind(this);
        this.getExecutorsList = this.getExecutorsList.bind(this);
        this.cannotExecute = this.cannotExecute.bind(this);
        this.showPasswordInput = this.showPasswordInput.bind(this);
        this.voteFor = this.voteFor.bind(this);
        this.voteAgainst = this.voteAgainst.bind(this);
    }

    componentDidMount() {

        const pass = localStorage.getItem(WALLET_PASSWORD);

        if (pass) {

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
                    project: response,
                    detailsLoaded: true
                });

                console.log(response);

            }).catch(error => {
            console.log(error);
        });

        getExecutors(projectId)
            .then(response => {
                this.setState({
                    executorsList: response
                });
            }).catch(error => {
                console.log(error);
            })
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

                this.setWallPass(this.state.walletPass);
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

        this.setState({
            processing: true
        });

        const projectId = parseInt(this.props.match.params.projectId);

        closeAndExecute(projectId, this.state.walletPass)
            .then(response => {
                notification.success({
                    message: 'Donate App',
                    description: 'Project executed.'
                });

                this.setWallPass(this.state.walletPass);
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

    cannotDonate() {
        console.log("Cannot donate");
        console.log(this.state.goalAmount);
        console.log(this.state.project.actualBalance);
        return this.state.project.goalAmount === this.state.project.actualBalance;
    }

    cannotExecute() {
        return this.state.project.numberOfVotes < this.state.project.donatorsNumber;
    }

    voteFor(e) {
        e.preventDefault();

        this.voteForProject(1);
    }

    voteAgainst(e) {
        e.preventDefault();

        this.voteForProject(-1);
    }

    voteForProject(value) {

        const projectId = parseInt(this.props.match.params.projectId);

        this.setState({
            processing: true
        });

        voteForExecution(projectId, value, this.state.walletPass)
            .then(response => {
                notification.success({
                    message: 'Donate App',
                    description: 'You voted for/against project execution'
                });

                this.setWallPass(this.state.walletPass);
                window.location.reload();

            }).catch(error => {

            notification.error({
                message: 'Donate App',
                description: 'Error while voting'
            });

            this.setState({
                processing: false
            });

        })
    }

    getExecutorsList() {
        return (
            <List itemLayout="horizontal"
                  dataSource={this.state.executorsList}
                  renderItem={e => (
                      <List.Item>
                          <List.Item.Meta
                              avatar={<Avatar icon="star" size="large"/>}
                              title={e.name}
                              description={e.address}
                          />
                      </List.Item>
                  )}/>
        )
    }


    getProperOptions() {

        console.log(this.state.currentUser);

        if (this.state.project.opened) {
            if (this.state.currentUser && this.state.currentUser.authorities[0].authority === "ROLE_INITIATOR") {
                return (
                    <Col span={16}>
                        {
                            this.state.detailsLoaded ?
                                <AddExecutorsComponent amountOfDonation={this.state.project.actualBalance}
                                                       handleSubmitExecutors={this.handleSubmitExecutors}/> :
                                null
                        }
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
                                <Button icon="play-circle" disabled={this.cannotDonate()} type="primary" size="large"
                                        onClick={this.donateProject}>
                                    DONATE
                                </Button>
                            </Col>
                        </div>
                    )
            }
        } else if (this.state.project.validationPhase) {

            const votingPercent = (this.state.project.numberOfVotes / this.state.project.donatorsNumber) * 100;

            const votingState = (
                <div>
                    <h4>Status of voting</h4>
                    <Progress percent={votingPercent} status="active" default={0}/>
                </div>
            );

            if (this.state.currentUser.authorities[0].authority === "ROLE_INITIATOR") {

                return (
                    <div>
                        <Col span={12}>
                            <h4> Choosen executors: </h4>
                            <hr/>
                            {this.getExecutorsList()}
                        </Col>
                        <Col span={8}>
                            {votingState}
                            <Button size="large" type="primary" disabled={this.cannotExecute()}
                                    onClick={this.closeProject}> EXECUTE PROJECT </Button>
                        </Col>
                    </div>
                )

            } else {

                let votingButtons;

                if (this.state.project.canUserVote) {
                    votingButtons = (
                        <Row>
                            <h4> Do you agree on this executors ? </h4>
                            <Button size="large" type="primary" shape="circle" icon="check"
                                    onClick={this.voteFor}/> &nbsp;
                            <Button size="large" shape="circle" icon="close" onClick={this.voteAgainst}/>
                        </Row>
                    )
                }


                return (
                    <div>
                        <Col span={12}>
                            <h4> Choosen executors: </h4>
                            <hr/>
                            {this.getExecutorsList()}
                        </Col>
                        <Col span={8}>
                            {votingState}
                            {votingButtons}
                        </Col>
                    </div>
                );
            }


        } else if (this.state.project.ifProjectSuccessful == null && this.state.currentUser.authorities && this.state.currentUser.authorities[0].authority === "ROLE_INITIATOR") {
            return (

                <Col offset={8} span={8}>
                    <Button style={{marginBottom: '10px'}} icon="play-circle" type="primary" size="large"
                            onClick={this.openProject}>
                        OPEN
                    </Button>
                    <Input size="large" name="goalAmount" type="text" placeholder="Type goal amount"
                           value={this.state.goalAmount} onChange={(event) => this.changeField(event)}/>
                </Col>

            )

        } else if (this.state.project.ifProjectSuccessful != null) {

            let text;

            if (this.state.project.ifProjectSuccessful) {
                text = (
                    <p style={{color: '#006600'}}><b>Project executed successfully - donation sent to executors.</b></p>
                )
            } else {
                text = (
                    <p><b>Project execution failed - donation sent back to donators</b></p>
                )
            }

            return (
                <div>
                    <Row>
                        {text}
                    </Row>
                </div>
            )
        }
    }

    setWallPass(pass) {
        localStorage.setItem(WALLET_PASSWORD, pass);
    }

    showPasswordInput() {
        return (this.state.currentUser.authorities && this.state.currentUser.authorities[0].authority === "ROLE_INITIATOR"
            && (this.state.project.address != null || this.state.project.ifProjectSuccessful == null)) ||
            (this.state.currentUser.authorities && this.state.currentUser.authorities[0].authority === "ROLE_DONATOR"
                && this.state.project.address != null && this.state.project.ifProjectSuccessful == null);
    }

    handleSubmitExecutors(executorsList) {

        this.setState({
            processing: true
        });

        console.log(executorsList);

        const rq = {
            chosenExecutors: executorsList
        };

        addExecutors(rq, this.state.project.id, this.state.walletPass)
            .then(response => {
                notification.success({
                    message: 'Donate App',
                    description: 'Validation phase opened!'
                });

                this.setWallPass(this.state.walletPass);
                window.location.reload();
            }).catch(error => {
            notification.error({
                message: 'Donate App',
                description: 'Adding executors went wrong!'
            });
            this.setState({
                processing: false
            });
        });

    }

    render() {

        let projectDetails;

        if (this.state.project.opened || this.state.project.validationPhase || this.state.project.ifProjectSuccessful != null) {
            projectDetails = (
                <Row>
                    <Col span={15}>
                        {this.state.project.summary}
                    </Col>
                    <Col offset={1} span={8}>
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
                        <p>{this.state.project.address}</p>

                        {projectDetails}

                        <Col>
                            <div className="download-project-container">
                                <Button icon="download" size="large" onClick={this.downloadProject}>
                                    Download details
                                </Button>
                            </div>
                        </Col>

                        <Row className="options-container" type="flex" justify="end">

                            <div className="project-options">
                                {this.getProperOptions()}
                            </div>

                            <Col span={6}>
                                {this.state.savedPass.length < 1 && this.showPasswordInput() ?
                                    <FormItem label="Submit your ethereum password">
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
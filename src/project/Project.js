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
import {Link} from 'react-router-dom';
import {
    Alert,
    Avatar,
    Button,
    Card,
    Col,
    Icon,
    Input,
    Layout,
    List,
    Modal,
    notification,
    Progress,
    Row,
    Statistic,
    Tooltip
} from 'antd';
import AddExecutorsComponent from './AddExecutorsComponent';
import './Project.css';
import {WALLET_PASSWORD} from "../storage";
import FormItem from "antd/es/form/FormItem";
import {getProperAvatar} from "../common/UtilsComponents";

const {Content} = Layout;
const {Countdown} = Statistic;

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
            executorsList: [],
            modalForEthPassword: false,
            executeOpen: false,
            executeClose: false,
            executeDonate: false,
            executeVoting: false,
            executeExecutorsChoose: false,
            chosenExecutors: [],
            fatalError: false
        };

        this.downloadProject = this.downloadProject.bind(this);
        this.openProjectClick = this.openProjectClick.bind(this);
        this.donateProjectClick = this.donateProjectClick.bind(this);
        this.getProperOptions = this.getProperOptions.bind(this);
        this.closeProjectClick = this.closeProjectClick.bind(this);
        this.setWallPass = this.setWallPass.bind(this);
        this.changeField = this.changeField.bind(this);
        this.handleSubmitExecutors = this.handleSubmitExecutors.bind(this);
        this.cannotDonate = this.cannotDonate.bind(this);
        this.voteForProject = this.voteForProject.bind(this);
        this.getExecutorsList = this.getExecutorsList.bind(this);
        this.cannotExecute = this.cannotExecute.bind(this);
        this.voteFor = this.voteFor.bind(this);
        this.voteAgainst = this.voteAgainst.bind(this);
        this.getVerificationLabel = this.getVerificationLabel.bind(this);
        this.onFinishVotingCountdown = this.onFinishVotingCountdown.bind(this);
        this.handleOkEthPassword = this.handleOkEthPassword.bind(this);
        this.handleCancelEthPassword = this.handleCancelEthPassword.bind(this);
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
            this.setState({
                fatalError: true
            });
        });

        const projectId = parseInt(this.props.match.params.projectId);
        console.log(this.props);

        getProject(projectId)
            .then(response => {
                this.setState({
                    project: response,
                    detailsLoaded: true
                });

                if (this.state.project.validationPhase) {
                    getExecutors(projectId)
                        .then(response => {
                            this.setState({
                                executorsList: response
                            });
                        }).catch(error => {
                        this.setState({
                            fatalError: true
                        });
                    })
                }

            }).catch(error => {
            this.setState({
                fatalError: true
            });
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

    openProjectClick(event) {
        event.preventDefault();

        const rq = {
            passwordToWallet: this.state.walletPass,
            projectId: this.state.project.id,
            amount: this.state.goalAmount
        };

        console.log(rq);


        if (this.state.savedPass.length < 1) {

            this.setState({
                modalForEthPassword: true,
                executeOpen: true
            })

        } else {
            this.setState({
                processing: true
            });
            this.executeOpenProject(rq);
        }
    }

    executeOpenProject(rq) {

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

    closeProjectClick(event) {
        event.preventDefault();

        this.setState({
            processing: true
        });

        const projectId = parseInt(this.props.match.params.projectId);

        if (this.state.savedPass.length < 1) {

            this.setState({
                modalForEthPassword: true,
                executeClose: true
            })

        } else {
            this.setState({
                processing: true
            });
            this.executeCloseProject(projectId);
        }
    }

    executeCloseProject(projectId) {
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

    donateProjectClick(event) {
        event.preventDefault();

        const id = parseInt(this.props.match.params.projectId);

        const rq = {
            projectId: id,
            amountOfDonation: this.state.amountOfDonation,
            passToWallet: this.state.walletPass
        };

        this.setState({
            processing: true
        });
        if (this.state.savedPass.length < 1) {

            this.setState({
                modalForEthPassword: true,
                executeDonate: true
            })

        } else {
            this.setState({
                processing: true
            });
            this.executeDonation(rq);
        }
    }

    executeDonation(rq) {
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


    cannotDonate() {
        return this.state.project.goalAmount === this.state.project.actualBalance;
    }

    cannotExecute() {
        return (this.state.project.numberOfVotes < this.state.project.donatorsNumber) &&
            (this.state.project.validationTimeLeft > 0);
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

        if (this.state.savedPass.length < 1) {

            this.setState({
                modalForEthPassword: true,
                executeVoting: true,
                valueOfVoting: value
            })

        } else {
            this.setState({
                processing: true
            });
            this.executeVoting(value);
        }

    }

    executeVoting(value) {
        const projectId = parseInt(this.props.match.params.projectId);

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

    onFinishVotingCountdown(e) {
        e.preventDefault();

        const pr = this.state.project;

        pr.validationTimeLeft = 0;

        this.setState({
            project: pr
        });
    }


    getProperOptions() {

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
                            <FormItem label="Submit amount of ether which you want donate">
                                <Input size="large" name="amountOfDonation"
                                       placeholder="Type amount" value={this.state.amountOfDonation}
                                       onChange={(event) => this.changeField(event)}/>
                            </FormItem>
                            <Button icon="play-circle" disabled={this.cannotDonate()} type="primary" size="large"
                                    onClick={this.donateProjectClick}>
                                DONATE
                            </Button>
                        </Col>
                    </div>
                )
            }
        } else if (this.state.project.validationPhase) {

            const endOfVoting = Date.now() + 1000 * this.state.project.validationTimeLeft;

            const votingPercent = (this.state.project.numberOfVotes / this.state.project.donatorsNumber) * 100;
            console.log(this.state);

            const countdownClock = (
                <div>
                    <Countdown title="To the end of the validation phase left:" value={endOfVoting}
                               onFinish={this.onFinishVotingCountdown}/>
                </div>
            );

            const votingState = (
                <div>
                    <h4>Status of voting</h4>
                    <Progress style={{width: '70%'}} percent={votingPercent} status="active" default={0}/>
                </div>
            );

            if (this.state.currentUser.authorities[0].authority === "ROLE_INITIATOR") {

                return (
                    <div>
                        <Row className="countdown-container">
                            <Col span={12}>
                                {countdownClock}
                            </Col>
                            <Col span={12}>
                                {votingState}
                            </Col>
                        </Row>
                        <Col span={14} className="executors-list-container">
                            <h4> Chosen executors: </h4>
                            <hr/>
                            {this.getExecutorsList()}
                        </Col>
                        <Col span={10} className="voting-options-container">
                            <Button size="large" type="primary" style={{marginTop: "10px"}}
                                    disabled={this.cannotExecute() || this.state.processing}
                                    onClick={this.closeProjectClick}> EXECUTE PROJECT </Button>
                        </Col>
                    </div>
                )

            } else {

                let votingButtons;

                if (this.state.project.canUserVote) {
                    votingButtons = (
                        <Row>
                            <h3> Do you agree on this executors ? </h3>
                            <Button size="large" type="primary" shape="circle" icon="check"
                                    onClick={this.voteFor} disabled={this.state.processing}/> &nbsp;
                            <Button size="large" shape="circle" icon="close" onClick={this.voteAgainst}
                                    disabled={this.state.processing}/>
                        </Row>
                    )
                }


                return (
                    <div>
                        <Row className="countdown-container">
                            <Col span={12}>
                                {countdownClock}
                            </Col>
                            <Col span={12}>
                                {votingState}
                            </Col>
                        </Row>
                        <Col span={14} className="executors-list-container">
                            <h4> Chosen executors: </h4>
                            <hr/>
                            {this.getExecutorsList()}
                        </Col>
                        <Col span={10} className="voting-options-container">
                            {votingButtons}
                        </Col>
                    </div>
                );
            }


        } else if (this.state.project.ifProjectSuccessful == null && this.state.currentUser.authorities && this.state.currentUser.authorities[0].authority === "ROLE_INITIATOR") {
            return (

                <Col span={8}>
                    <FormItem label="Type goal of project and open gathering">
                        <Input size="large" name="goalAmount" type="text" placeholder="Type goal amount"
                               value={this.state.goalAmount} onChange={(event) => this.changeField(event)}/>

                        <Button style={{margin: '10px 10px 10px 10px'}} icon="play-circle" type="primary" size="large"
                                onClick={this.openProjectClick} disabled={this.state.processing}>
                            OPEN
                        </Button>
                    </FormItem>
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

    handleSubmitExecutors(executorsList) {

        if (this.state.savedPass.length < 1) {

            this.setState({
                modalForEthPassword: true,
                executeExecutorsChoose: true,
                chosenExecutors: executorsList
            })

        } else {
            this.setState({
                processing: true
            });
            const rq = {
                chosenExecutors: executorsList
            };
            this.executeExecutorsChoose(rq);
        }
    }

    executeExecutorsChoose(rq) {
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

    getVerificationLabel() {
        if (this.state.project.address != null && this.state.project.verified) {
            return (
                <div>
                    <Tooltip title="Project version compared with copy on blockchain">
                        <Icon type="check" size="large" style={{color: '#04B404'}}/>
                        <span style={{color: '#04B404'}}><b>Project version verified</b></span>
                    </Tooltip>
                </div>
            )
        } else if (this.state.project.address != null) {
            return (
                <div>
                    <Tooltip title="Project version compared with copy on blockchain">
                        <Icon type="warning" size="large" style={{color: '#DC143C'}}/>
                        <span style={{color: '#DC143C'}}><b>Project version changed</b></span>
                    </Tooltip>
                </div>
            )
        }
    }

    handleOkEthPassword(e) {
        e.preventDefault();

        this.setState({
            processing: true
        });

        if (this.state.executeOpen) {
            const rq = {
                passwordToWallet: this.state.walletPass,
                projectId: this.state.project.id,
                amount: this.state.goalAmount
            };

            this.executeOpenProject(rq);
        }

        if (this.state.executeClose) {
            const projectId = parseInt(this.props.match.params.projectId);
            this.executeCloseProject(projectId);
        }

        if (this.state.executeDonate) {
            const id = parseInt(this.props.match.params.projectId);

            const rq = {
                projectId: id,
                amountOfDonation: this.state.amountOfDonation,
                passToWallet: this.state.walletPass
            };
            this.executeDonation(rq);
        }

        if (this.state.executeVoting) {
            this.executeVoting(this.state.valueOfVoting);

            this.setState({
                valueOfVoting: null
            });
        }

        if (this.state.executeExecutorsChoose) {

            const rq = {
                chosenExecutors: this.state.chosenExecutors
            };

            this.executeExecutorsChoose(rq);
        }

        this.setState({
            executeOpen: false,
            executeClose: false,
            executeDonate: false,
            executeVoting: false,
            modalForEthPassword: false
        })

    }

    handleCancelEthPassword(e) {
        e.preventDefault();

        this.setState({
            modalForEthPassword: false
        })
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
                {this.state.fatalError ?
                    <Alert
                        message="Error"
                        description="Fatal error during retrieving project details!"
                        type="error"
                        showIcon
                    /> :
                    <div>
                        <Modal visible={this.state.modalForEthPassword}
                               title="Wallet password"
                               centered
                               onOk={this.handleOkEthPassword}
                               onCancel={this.handleCancelEthPassword}>
                            <FormItem label="Submit your ethereum password">
                                <Input size="large" name="walletPass" type="password"
                                       placeholder="Type your wallet password" value={this.state.walletPass}
                                       onChange={(event) => this.changeField(event)}/>
                            </FormItem>
                        </Modal>
                        <div className="project-container">
                            <Content>
                                <h3>
                                    {this.getVerificationLabel()} &nbsp;
                                    {getProperAvatar(this.state.project)} &nbsp; &nbsp;&nbsp;
                                    {this.state.project.name} &nbsp;
                                    {processingIcon}
                                </h3>
                                <p>{this.state.project.address}</p>

                                {this.state.project.openingDate ? <p>{ "Opened at: " + this.state.project.openingDate}</p> : null}
                                {this.state.project.executionDate ? <p>{"Executed at: " + this.state.project.executionDate}</p> : null}

                                <div className="project-details">
                                    {projectDetails}
                                </div>

                                <Row className="details-clickable-row">
                                    <Col span={9}>
                                        <div className="project-clickable-details">
                                            <Button icon="download" size="large" onClick={this.downloadProject}>
                                                Download details
                                            </Button>
                                            <Link to={{pathname: `/account/${this.state.project.owner}`}}>
                                                <Avatar style={{backgroundColor: '#1890ff'}} icon="user"/>
                                                &nbsp;
                                                {this.state.project.owner}
                                            </Link>
                                        </div>
                                    </Col>
                                </Row>

                                <Row className="project-options">
                                    {this.getProperOptions()}
                                </Row>

                            </Content>
                        </div>
                    </div>
                }
            </Layout>
        );
    }
}

export default Project;
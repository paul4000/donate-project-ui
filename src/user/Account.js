import React, {Component} from 'react';
import {currentUser, downloadUserWallet, getAccount} from "../common/RequestsHelper";
import {Button, Col, Icon, notification, Row, Statistic} from 'antd';
import './Account.css';

class Account extends Component {

    constructor(props) {

        super(props);
        this.state = {
            account: {},
            currentUser: {}
        };

        this.getProjectStatistics = this.getProjectStatistics.bind(this);
        this.downloadWallet = this.downloadWallet.bind(this);
    }

    componentDidMount() {

        currentUser()
            .then(response => {
                    this.setState({
                        currentUser: response
                    });

                    getAccount(this.props.match.params.username)
                        .then(response => {
                                this.setState({
                                    account: response
                                });
                            }
                        ).catch(error => {
                        console.log(error);
                    })
            }
            ).catch(error => {
            console.log(error);
        });

    }

    downloadWallet(event) {
        event.preventDefault();

        downloadUserWallet()
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
                description: 'Problem with downloading wallet'
            });
        })
    }

    getProjectStatistics() {
        let executed = this.state.account.numberOfSuccessfulProjects + this.state.account.numberOfFailedProjects;

        let successful;

        if (executed > 0) {
            successful = (this.state.account.numberOfSuccessfulProjects / executed) * 100
        } else {
            successful = 0;
        }
        if (this.state.account && this.state.account.type === "INITIATOR") {
            return (
                <Row>
                    <h3> Projects statistics </h3>
                    <Col span={4} offset={8}>
                        <Statistic title="Successful projects" precision={2} value={successful}
                                   prefix={<Icon type="file-done"/>} valueStyle={{color: '#3f8600'}} suffix="%"/>
                    </Col>
                    <Col span={4}>
                        <Statistic title="Executed" value={executed} suffix={"/" + this.state.account.numberOfProject}/>
                    </Col>
                </Row>
            );
        }
    }

    getWalletIfCan = () => (
        this.props.match.params.username === this.state.currentUser.username ?
            <Button icon="download" style={{margin: "10px 10px 10px 10px"}} size="small" onClick={this.downloadWallet}>
                Download wallet
            </Button> : null
    );

    render() {
        return (
            <div className="account-details">
                <Row>
                    <h3> User Info </h3>
                    <div><b> Name: </b> {this.state.account.name} </div>
                    <div><b> Username: </b> {this.state.account.username} </div>
                    <div><b> Email: </b> {this.state.account.email} </div>
                    <div><b> Account: </b> {this.state.account.account} </div>
                    <div><b> Account balance: </b> {this.state.account.accountBalance + " ETH"} </div>

                    {this.getWalletIfCan()}

                </Row>

                {this.getProjectStatistics()}
            </div>
        );
    }

}

export default Account;
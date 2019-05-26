import React, {Component} from 'react';
import {getProject} from "../common/RequestsHelper";
import {Button, Layout, notification} from 'antd';

import {downloadProjectDetails} from '../common/RequestsHelper';

import './Project.css';

const {Content} = Layout;

class Project extends Component {

    constructor(props) {
        super(props);
        this.state = {
            project: {}
        };

        this.downloadProject = this.downloadProject.bind(this);
    }

    componentDidMount() {
        const projectId = parseInt(this.props.match.params.projectId);

        console.log(this.props);

        getProject(projectId)
            .then(response => {
                this.setState({
                    project: response
                });

            }).catch(error => {
            console.log(error);
        })

    }

    downloadProject(event) {
        event.preventDefault();

        downloadProjectDetails(this.state.project.id)
            .then(response => {
                const projectFileName =  response.headers.get('Content-Disposition').split('filename=')[1];
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

    render() {
        return (
            <Layout>
                <div className="project-container">
                    <Content>
                        <h3>{this.state.project.name}</h3>

                        <div>
                            {this.state.project.summary}
                        </div>

                        <div className="download-project-container">
                            <Button icon="download" type="primary" size="large" onClick={this.downloadProject}>
                                Download details
                            </Button>
                        </div>

                    </Content>
                </div>
            </Layout>
        );
    }


}

export default Project;
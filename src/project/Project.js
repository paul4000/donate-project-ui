import React, {Component} from 'react';
import {getProject} from "../common/RequestsHelper";
import {Layout, Link} from 'antd';

import './Project.css';

const {Content} = Layout;

class Project extends Component {

    constructor(props) {
        super(props);
        this.state = {
            project: {}
        }
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

    render() {
        return (
            <Layout>
                <div className="project-container">
                    <Content>
                        <h3>{this.state.project.name}</h3>

                        <div>
                            {this.state.project.summary}
                        </div>


                    </Content>
                </div>
            </Layout>
        );
    }


}

export default Project;
import React, {Component} from 'react';

import './Submission.css';
import {Button, Form, Icon, Input, notification, Row, Upload} from 'antd';
import {addProject} from "../common/RequestsHelper";

const {TextArea} = Input;

const FormItem = Form.Item;

class Submission extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: {
                value: ''
            },
            summary: {
                value: ''
            },
            project: {
                value: {}
            }
        };

        this.onProjectChange = this.onProjectChange.bind(this);
        this.saveProject = this.saveProject.bind(this);
        this.onProjectParamsChange = this.onProjectParamsChange.bind(this);
        this.checkFileSize = this.checkFileSize.bind(this);
        this.dummyRequest = this.dummyRequest.bind(this);
    }

    onProjectChange(event) {

        console.log(event);
        this.setState({
            project: {
                value: event.fileList[0],
                ...this.checkFileSize(event.fileList[0])
            }
        });

        console.log(this.state)

    }

    dummyRequest = ({file, onSuccess}) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    saveProject(event) {
        event.preventDefault();

        const projectData = new FormData();
        projectData.append('multipartFile', this.state.project.value, this.state.project.value.name);
        projectData.append('name', this.state.name.value);
        projectData.append('summary', this.state.summary.value);

        addProject(projectData)
            .then(response => {
                console.log(response);
                notification.success({
                    message: 'Donate App',
                    description: 'Added project'
                });
            }).catch(error => {
            console.log(error);
            notification.error({
                message: 'Donate App',
                description: 'Failure during adding project'
            });
        })

    }

    onProjectParamsChange(event) {
        const target = event.target;
        const fieldName = target.name;
        const fieldValue = target.value;

        this.setState({
            [fieldName]: {
                value: fieldValue
            }
        })
    }

    checkFileSize = (file) => {

        console.log("checking file size");
        if (file.size > 4000000) {
            return {
                validationStatus: 'error',
                msg: 'File too big'
            }
        }
    };


    render() {
        return (
            <div className="submission-container">
                <h3 className="page-title">Submit your project</h3>
                <Row className="submit-content" type="flex" justify="center" align="middle">
                    <Form className="submission-form" onSubmit={this.saveProject}>
                        <FormItem label="Project name">
                            <Input size="large" name="name" placeholder="Type project name"
                                   value={this.state.name.value}
                                   onChange={(event) => this.onProjectParamsChange(event)}/>
                        </FormItem>
                        <FormItem label="Write short summary (4096 signs)">
                            <TextArea size="large" name="summary" placeholder="Type summary"
                                      value={this.state.summary.value}
                                      onChange={(event) => this.onProjectParamsChange(event)}
                                      autosize={{minRows: 2}}/>
                        </FormItem>
                        <FormItem label="Upload your project in PDF file"
                                  validateStatus={this.state.project.validationStatus}
                                  help={this.state.project.msg}>
                            <Upload name="project" customRequest={this.dummyRequest} onChange={(event) => this.onProjectChange(event)}>
                                <Button>
                                    <Icon type="upload"/> Click to Upload
                                </Button>
                            </Upload>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" size="large" className="save-button">
                                Save
                            </Button>
                        </FormItem>
                    </Form>
                </Row>
            </div>
        );
    }
}

export default Submission;
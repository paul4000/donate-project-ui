import React, {Component} from 'react';

import './Submission.css';
import {Button, Form, Input, Row, Upload, Icon} from 'antd';
const { TextArea } = Input;

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
                value: ''
            }
        };

        this.onProjectChange = this.onProjectChange.bind(this);
        this.saveProject = this.saveProject.bind(this);
        this.onProjectParamsChange = this.onProjectParamsChange.bind(this);
        this.checkFileSize = this.checkFileSize.bind(this);
        this.dummyRequest = this.dummyRequest.bind(this);
    }

    onProjectChange(event) {

        this.setState({
            project: {
                value: event.file,
                ...this.checkFileSize(event.file)
            }
        });

        console.log(this.state)

    }

    dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    saveProject(event) {
        event.preventDefault();

        const data = new FormData();
        data.append('multipartFile', this.state.project);
        data.append('name', this.state.name);
        data.append('summary', this.state.summary);
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
                            <Input size="medium" name="name" placeholder="Type project name"
                                   value={this.state.name.value}
                                   onChange={(event) => this.onProjectParamsChange(event)}/>
                        </FormItem>
                        <FormItem label="Write short summary (4096 signs)">
                            <TextArea size="medium" name="summary" placeholder="Type summary"
                                   value={this.state.summary.value}
                                   onChange={(event) => this.onProjectParamsChange(event)}
                                   autosize={{ minRows: 2 }}/>
                        </FormItem>
                        <FormItem label="Upload your project in PDF file"
                                  validateStatus={this.state.project.validationStatus}
                                    help={this.state.project.msg}>
                            <Upload name="project" customRequest={this.dummyRequest} onChange={this.onProjectChange}>
                                <Button>
                                    <Icon type="upload" /> Click to Upload
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
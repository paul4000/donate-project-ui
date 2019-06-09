import React from 'react';
import {Avatar, List} from 'antd';
import {
    Link,
    withRouter
} from 'react-router-dom';

class ProjectList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            projectList: this.props.projectsList
        };

        this.iconForProject = this.iconForProject.bind(this);
    }

    iconForProject = (isOpened) => {
        if (isOpened) {
            return "unlock"
        } else {
            return "lock"
        }
    };

    render() {
        return (
            <List
                itemLayout="vertical"
                style={{width: "70%"}}
                dataSource={this.props.projectsList}
                renderItem={project => (
                    <Link to={{pathname: `/project/details/${project.id}`}}>
                        <List.Item style={{alignContent: "center"}}>
                            <List.Item.Meta
                                avatar={<Avatar icon={this.iconForProject(project.opened)} size="large"/>}
                                title={project.name}
                                description={project.author}
                            />
                            <div>{project.summary}</div>
                        </List.Item>
                    </Link>
                )}
            />
        );
    }
}

export default ProjectList;
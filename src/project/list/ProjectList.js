import React from 'react';
import {Avatar, List} from 'antd';

class ProjectList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            projectList: this.props.projectList
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
                dataSource={this.state.projectList}
                renderItem={project => (
                    <List.Item style={{alignContent: "center"}}>
                        <List.Item.Meta
                            avatar={<Avatar icon={this.iconForProject(project.isOpened)} size="large"/>}
                            title={project.name}
                            description={project.author}
                        />
                        <div>{project.summary}</div>
                    </List.Item>
                )}
            />
        );
    }
}

const projectList = [
    {
        name: "EXAMPLE 1",
        summary: "Nam augue libero, auctor eget vehicula quis, gravida nec dolor. Vestibulum eget semper dui. " +
            "Donec suscipit consequat elit, scelerisque sodales lacus",
        author: "INITIATOR 1",
        isOpened: true
    },
    {
        name: "EXAMPLE 2",
        summary: "Nam augue libero, auctor eget vehicula quis, gravida nec dolor. Vestibulum eget semper dui. " +
            "Donec suscipit consequat elit, scelerisque sodales lacus",
        author: "INITIATOR 1",
        isOpened: false
    },
    {
        name: "EXAMPLE 3",
        summary: "Sed maximus ligula sapien, at congue odio feugiat et. Donec augue tortor, tempus eu commodo molestie, " +
            "vestibulum nec lacus. Cras scelerisque iaculis est a euismod",
        author: "INITIATOR 2",
        isOpened: true
    },
    {
        name: "EXAMPLE 4",
        summary: "Duis semper lectus faucibus lacus imperdiet ultrices. Nunc consectetur ipsum tincidunt metus commodo, " +
            "volutpat elementum elit vestibulum",
        author: "INITIATOR 3",
        isOpened: false
    },
];

export default ProjectList;
import React, {Component} from 'react';
import { List, Layout, Menu, Dropdown, Icon, Skeleton } from 'antd';
import {
    Link,
    withRouter
} from 'react-router-dom';

class ProjectList extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <List
                className="demo-loadmore-list"
                // loading={initLoading}
                itemLayout="horizontal"
                // loadMore={loadMore}
                dataSource={this.props.projectList}
                renderItem={project => (
                    <List.Item>
                        <ProjectIcon isOpened={project.isOpened}/>
                        <Skeleton avatar title={false} loading={project.loading} active>
                            <List.Item.Meta
                                // avatar={
                                //     <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                // }
                                title={project.name}
                                description={project.summary}
                                //tutaj link do szczegolow
                            />
                            <div>content</div>
                        </Skeleton>
                    </List.Item>
                )}
            />
        );
    }
}

function ProjectIcon(isOpened) {
    if(isOpened){
        return <Icon type="unlock" className="nav-icon" />
    } else {
        return <Icon type="lock" className="nav-icon" />
    }
}
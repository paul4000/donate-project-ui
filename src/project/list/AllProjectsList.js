import React from 'react';
import ProjectList from './ProjectList';

class AllProjectsList extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            projects: []
        }
    }

    componentDidMount() {
        //call to API and setting projects

    }

    render(){
        return (
            <ProjectList projectsList={this.state.projects}/>
        );
    }

}

export default AllProjectsList;
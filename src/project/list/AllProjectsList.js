import React from 'react';
import ProjectList from './ProjectList';
import {getAllProjects} from "../../common/RequestsHelper";

class AllProjectsList extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            projects: []
        }
    }

    componentDidMount() {
        //call to API and setting projects
        getAllProjects()
            .then(response => {

                this.setState({
                    projects: response,
                });

            }).catch(error => {
            console.log(error);
        })

    }

    render(){
        return (
            <ProjectList projectsList={this.state.projects}/>
        );
    }

}

export default AllProjectsList;
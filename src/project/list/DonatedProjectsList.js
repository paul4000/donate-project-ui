import React from 'react';
import ProjectList from './ProjectList';
import {getDonatedProjectsOfUser} from "../../common/RequestsHelper";

class DonatedProjectsList extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            projects: []
        }
    }

    componentDidMount() {

        getDonatedProjectsOfUser()
            .then(response => {
                this.setState({
                    projects : response
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

export default DonatedProjectsList;
import React from 'react';
import ProjectList from './ProjectList';
import {getAllProjects} from "../../common/RequestsHelper";

class MyProjectsList extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            projects: [],
            isLoading: true,
        }
    }

    componentDidMount() {
        getAllProjects()
            .then(response => {

                this.setState({
                    projects: response,
                    isLoading: false
                });

                console.log(this.state);

            }).catch(error => {
            console.log(error);
            this.setState({
                isLoading: false
            });
        })

    }

    render(){
        if(this.state.isLoading){
           return ( <div>Loading list...</div> );
        } else
        {
            return (<ProjectList projectsList={this.state.projects}/>);
        }

    }

}
export default MyProjectsList;
import {Avatar} from "antd";
import React from "react";


export function getProperAvatar(project) {

        if (project.opened) {
            return <Avatar size="large" icon="unlock" style={{backgroundColor: '#04B404'}}/>
        }

        if (project.validationPhase) {
            return <Avatar size="large" icon="unlock" style={{backgroundColor: '#FACC2E'}}/>
        }

        if (project.ifProjectSuccessful) {
            return <Avatar size="large" icon="check" style={{backgroundColor: '#04B404'}}/>
        }

        if (!project.isOpened && project.ifProjectSuccessful === null) {
            return <Avatar size="large" icon="lock"/>
        }

        if (!project.ifProjectSuccessful) {
            return <Avatar size="large" icon="check" style={{backgroundColor: '#FFBF00'}}/>
        }
    }

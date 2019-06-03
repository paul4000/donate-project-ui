import {ACCESS_TOKEN} from '../storage';

const API_SERVER = "http://localhost:8080";
const REGISTER_URL = API_SERVER + "/users/register";
const LOGIN_URL = API_SERVER + "/users/login";
const CURRENT_USER_URL = API_SERVER + "/users/currentUser";
const PROJECT_SUBMISSION_URL = API_SERVER + "/project/upload";
const PROJECT_DETAILS = API_SERVER + "/project/detalis";
const ALL_PROJECT_URL = API_SERVER + "/project/all";
const DOWNLOAD_PROJECT_URL = API_SERVER + "/project/download/details";
const OPEN_PROJECT_URL = API_SERVER + "/project/open";


function prepareFetchOptions(requestOptions) {
    const headers = new Headers({
        'Content-Type': 'application/json',
    });

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    requestOptions = Object.assign({}, {headers: headers}, requestOptions);
    return requestOptions;
}

const request = (requestOptions) => {

    requestOptions = prepareFetchOptions(requestOptions);

    return fetch(requestOptions.url, requestOptions)
        .then(response => {
                if (!response.ok) {
                    return Promise.reject(response);
                }

                return response.json();
            }
        );
};

export function addProject(projectData) {

    const headers = new Headers(/*{
        'Content-Type': 'multipart/form-data',
    }*/);

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    for (let pair of projectData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
    }

    return fetch(PROJECT_SUBMISSION_URL, {
        method: 'POST',
        headers: headers,
        body: projectData
    }).then(response => {
            if (!response.ok) {
                return Promise.reject(response);
            }

            return response.json();
        }
    );
}

export function registerUser(userData) {

    return request({
        url: REGISTER_URL,
        method: 'POST',
        body: JSON.stringify(userData)
    });
}

export function loginUser(userData) {

    return request({
        url: LOGIN_URL + `?username=${encodeURIComponent(userData.username)}&password=${encodeURIComponent(userData.password)}`,
        method: 'GET'
    });
}

export function currentUser() {

    return request({
        url: CURRENT_USER_URL,
        method: 'GET'
    });
}

export function getProject(projectId) {

    return request({
        url: PROJECT_DETAILS + `/${encodeURIComponent(projectId)}`,
        method: 'GET'
    });
}

export function getAllProjects() {

    return request({
        url: ALL_PROJECT_URL,
        method: 'GET'
    });
}

export function openProject(data) {

    return request({
        url: OPEN_PROJECT_URL,
        method: 'POST',
        body : JSON.stringify(data)
    });
}

export function downloadProjectDetails(projectId){

    const options = prepareFetchOptions({
        url: DOWNLOAD_PROJECT_URL + `/${encodeURIComponent(projectId)}`,
        method: 'GET'
    });

    return fetch(options.url, options)
        .then(response => {
                if (!response.ok) {
                    return Promise.reject(response);
                }

                return response;
            }
        );
}


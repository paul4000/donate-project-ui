import {ACCESS_TOKEN} from '../storage';

const API_SERVER = "http://localhost:8080";

// USERS
const REGISTER_URL = API_SERVER + "/users/register";
const LOGIN_URL = API_SERVER + "/users/login";
const CURRENT_USER_URL = API_SERVER + "/users/currentUser";
const GET_ACCOUNT_URL = API_SERVER + "/users/account";
const EXECUTOR_LIST_URL = API_SERVER + "/users/executors";
const GET_USER_WALLET_URL = API_SERVER + "/users/wallet";

// PROJECT
const PROJECT_SUBMISSION_URL = API_SERVER + "/project/upload";
const PROJECT_DETAILS = API_SERVER + "/project/detalis";
const ALL_PROJECT_URL = API_SERVER + "/project/all";
const DOWNLOAD_PROJECT_URL = API_SERVER + "/project/download/details";
const OPEN_PROJECT_URL = API_SERVER + "/project/open";
const MY_PROJECTS_URL = API_SERVER + "/project/my";
const CLOSE_PROJECT_URL = API_SERVER + "/project/close";
const GET_EXECUTORS_URL = API_SERVER + "/project/executors";

// DONATE
const DONATE_PROJECT_URL = API_SERVER + "/donate";
const ADD_EXECUTOR_LIST_URL = API_SERVER + "/donate/executors";
const VOTING_URL = API_SERVER + "/donate/vote";
const GET_DONATED_BY_USER_URL = API_SERVER + "/donate/projects";


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

export function getAccount(username) {
    return request({
        url: GET_ACCOUNT_URL + `/${encodeURIComponent(username)}`,
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

export function getUserProjects() {

    return request({
        url: MY_PROJECTS_URL,
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

export function donateProject(data) {

    const rq = {
        amountOfDonation: data.amountOfDonation,
        passToWallet: data.passToWallet
    };

    return request({
        url: DONATE_PROJECT_URL + `/${encodeURIComponent(data.projectId)}`,
        method: 'POST',
        body: JSON.stringify(rq)
    })

}

export function addExecutors(data, projectId, walletPass) {

    return request({
        url: ADD_EXECUTOR_LIST_URL + `/${encodeURIComponent(projectId)}?walletPass=${encodeURIComponent(walletPass)}`,
        method: 'POST',
        body: JSON.stringify(data)
    })

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

export function downloadUserWallet(){

    const options = prepareFetchOptions({
        url: GET_USER_WALLET_URL,
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


export function getAllExecutorList() {
    return request({
        url: EXECUTOR_LIST_URL,
        method: 'GET'
    });
}

export function voteForExecution(projectId, value, pass) {
    return request({
        url: VOTING_URL + `/${encodeURIComponent(projectId)}/?walletPass=${encodeURIComponent(pass)}&value=${encodeURIComponent(value)}`,
        method: 'POST'
        });
}

export function closeAndExecute(projectId, pass) {
    return request({
        url: CLOSE_PROJECT_URL + `/${encodeURIComponent(projectId)}/?walletPass=${encodeURIComponent(pass)}`,
        method: 'POST'
    });
}

export function getExecutors(projectId) {
    return request({
        url: GET_EXECUTORS_URL + `/${encodeURIComponent(projectId)}`,
        method: 'POST'
    });
}

export function getDonatedProjectsOfUser() {
    return request({
        url: GET_DONATED_BY_USER_URL,
        method: 'GET'
    })
}

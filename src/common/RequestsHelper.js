const API_SERVER = "http://localhost:8080";
const REGISTER_URL = API_SERVER + "/users/register";
const request = (requestOptions) => {

    const headers = new Headers({
        'Content-Type': 'application/json',
    });

    requestOptions = Object.assign({}, {headers: headers}, requestOptions);

    return fetch(requestOptions.url, requestOptions)
        .then(response => {
                console.log(response);
                if(response)
                response.json().then(json => {
                    if (!response.ok) {
                        return Promise.reject(json);
                    }
                    return json;
                })
            }
        );
};
const LOGIN_URL = API_SERVER + "/users/login";

const CURRENT_USER_URL = API_SERVER + "/users/currentUser";

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

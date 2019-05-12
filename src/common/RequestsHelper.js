
const API_SERVER = "http://localhost:8080";
const REGISTER_URL = API_SERVER + "/users/register";

const request = (requestOptions) => {

    const headers = new Headers({
        'Content-Type': 'application/json',
    });

    requestOptions = Object.assign({}, {headers : headers}, requestOptions);

    return fetch(requestOptions.url, requestOptions)
        .then(response =>
            response.json().then(json => {
                if(!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );

};

export function registerUser(userData) {

    return request({
        url: REGISTER_URL,
        method: 'POST',
        body: JSON.stringify(userData)
    });
}
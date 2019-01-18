export default class Http {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    jsonPost = (action, payload) => {
        return new Promise((resolve, reject) => {
            fetch(this.baseUrl + action, {
                method: 'POST',
                // credentials: 'include',
                body: JSON.stringify(payload),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    //'Access-Control-Allow-Origin': '*'
                }
            })
                .then(response => response.json())
                .then(responseJson => {
                    if (responseJson.success) {
                        resolve(responseJson);
                    }

                    reject(responseJson.error);
                })
                .catch(error => {
                    reject(error);
                });
        });
    };

    formPost = (action, payload) => {
        return new Promise((resolve, reject) => {
            const _formData = Object.keys(payload).map((key) => {
                return encodeURIComponent(key) + '=' + encodeURIComponent(payload[key]);
            }).join('&');

            fetch(this.baseUrl + action, {
                method: 'POST',
                credentials: 'include',
                // credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                body: _formData
            })
                .then(response => response.json())
                .then(responseJson => {
                    if (responseJson.success) {
                        resolve(responseJson);
                    }

                    reject(responseJson.error);
                })
                .catch(error => {
                    reject(error);
                });
        });
    };

    formMultiPartPost = (action, payload) => {
        return new Promise((resolve, reject) => {
            const _formData = new FormData();
            for (let k in payload) {
                console.log(typeof payload[k], payload[k]);

                _formData.append(k, payload[k]);
            }

            fetch(this.baseUrl + action, {
                method: 'POST',
                credentials: 'include',
                processData: false,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data'
                },
                body: _formData
            })
                .then(response => response.json())
                .then(responseJson => {
                    if (responseJson.success) {
                        resolve(responseJson);
                    }

                    reject(responseJson.error);
                })
                .catch(error => {
                    reject(error);
                });
        });
    };

    jsonGet = action => {
        return new Promise((resolve, reject) => {
            fetch(this.baseUrl + action, {
                //credentials: 'include'
            })
                .then(response => response.json())
                .then(responseJson => {
                    resolve(responseJson);
                })
                .catch(error => {
                    reject(error);
                });
        });
    };
}

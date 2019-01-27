import http from "k6/http";

export function get(url, jSessionId, params = null) {
    var headers = getHeaders(null, jSessionId);
    return http.get(url, params, {headers: headers});
}

export function put(url, jSessionId, payload) {
    var headers = getHeaders(payload, jSessionId);
    return http.put(url, JSON.stringify(payload), {headers: headers})
}

export function post(url, payload = null, params = null, jSessionId = null) {
    var headers = getHeaders(payload, jSessionId);
    if (params === null) {
        return http.post(url, JSON.stringify(payload), {headers: headers});
    } else {
        return http.post(url, params);
    }
}

function getHeaders(payload = null, jSessionId = null) {
    var headers = {};
    if (payload !== null) {
        headers["Content-Type"] = "application/json";
    }
    if (jSessionId !== null) {
        headers["Cookie"] = "JSESSIONID=" + jSessionId;
    }
    return headers;
}

import {check, group, sleep} from "k6";
import {addToTrend, baseUrl, options, statusIs200} from "../commons/common.js";
import {post} from "../utils/apiClient.js";

export {options};

export function accountLogin(username, password) {
    var url = baseUrl() + "login";
    var params = {username: username, password: password};
    return post(url, null, params);
}

export function getJSessionId(username, password) {
    var response = accountLogin(username, password);
    return response.cookies.JSESSIONID[0].value;
}

export function getJSessionIdFromResponse(loginResponse) {
    return loginResponse.cookies.JSESSIONID[0].value;
}

export default function () {
    group("login to shop as admin", function () {
        var response = accountLogin("admin", "test");
        statusIs200(response);
        addToTrend(response);
    });
}
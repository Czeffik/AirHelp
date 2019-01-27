import {check, group, sleep} from "k6";
import {addToTrend, baseUrl, options, statusIs200} from "../commons/common.js";
import {getJSessionId} from "./login.js";
import {get} from "../utils/apiClient.js";

export {options};

export function currentUser(jSessionId) {
    var url = baseUrl() + "api/user/current";
    return get(url, jSessionId);
}

export default function () {
    group("log to shop as client and get current user", function () {
        var client = "client";
        var password = "test";
        var jSessionId = getJSessionId(client, password);
        var response = currentUser(jSessionId);
        statusIs200(response);
        addToTrend(response);
    });
}
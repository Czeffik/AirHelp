import {check, group, sleep} from "k6";
import {addToTrend, baseUrl, options, statusIs200} from "../commons/common.js";
import {getJSessionId} from "./login.js";
import {get} from "../utils/apiClient.js";

export {options};

export function products(jSessionId) {
    var url = baseUrl() + "api/select/products";
    return get(url, jSessionId);
}

export default function () {
    group("log to shop as client and get products", function () {
        var client = "client";
        var password = "test";
        var jSessionId = getJSessionId(client, password);
        var response = products(jSessionId);
        statusIs200(response);
        addToTrend(response);
    });
}
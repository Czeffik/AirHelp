import {check, group, sleep} from "k6";
import {addToTrend, baseUrl, options, statusIs200} from "../commons/common.js";
import {getJSessionId} from "./login.js";
import {get} from "../utils/apiClient.js";

export {options};

export function orders(jSessionId, size = 1000, page = 0) {
    var url = baseUrl() + "api/orders/";
    var params = {size: size, page: page};
    return get(url, jSessionId, params);
}

export default function () {
    group("login as employee and get orders", function () {
        var client = "employee";
        var password = "test";
        var jSessionId = getJSessionId(client, password);
        var response = orders(jSessionId);
        statusIs200(response);
        addToTrend(response);
    });
}
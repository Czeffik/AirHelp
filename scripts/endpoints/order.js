import {check, group, sleep} from "k6";
import {addToTrend, baseUrl, options, statusIs200} from "../commons/common.js";
import {getJSessionId} from "./login.js";
import {orders} from "./orders.js";
import {get} from "../utils/apiClient.js";

export {options};

export function getOrder(jSessionId, orderId) {
    var url = baseUrl() + "api/orders/" + orderId;
    return get(url, jSessionId);
}

export default function () {
    group("login as employee and get order by order id", function () {
        var jSessionId = getJSessionId("employee", "test");
        var ordersArray = JSON.parse(orders(jSessionId).body).content;
        if (ordersArray.length === 0) {
            throw new Error("Could not find any order in shop...")
        }
        var order = ordersArray[0];
        var response = getOrder(jSessionId, order.id);
        statusIs200(response);
        addToTrend(response);
    });
}
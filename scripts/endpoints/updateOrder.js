import {check, group, sleep} from "k6";
import {addToTrend, baseUrl, options, statusIs200} from "../commons/common.js";
import {getJSessionId} from "./login.js";
import {orders} from "./orders.js";
import {put} from "../utils/apiClient.js";

export {options};

export function updateOrder(jSessionId, order, status = "ACCEPTED") {
    var orderId = order.id;
    var url = baseUrl() + "api/orders/" + orderId;
    order.status = status;
    return put(url, jSessionId, order);
}

export default function () {
    group("login as employee, get orders and change status", function () {
        var client = "employee";
        var password = "test";
        var jSessionId = getJSessionId(client, password);
        var ordersResponse = JSON.parse(orders(jSessionId).body);
        var ordersContent = ordersResponse.content;
        var order = ordersContent[0];
        var orderStatus = order.status;
        var response = null;
        if (orderStatus === "ACCEPTED") {
            response = updateOrder(jSessionId, order, "DRAFT");
        } else {
            response = updateOrder(jSessionId, order);
        }

        statusIs200(response);
        addToTrend(response);
    });
}

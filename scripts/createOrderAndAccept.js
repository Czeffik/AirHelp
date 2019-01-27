import {check, group, sleep} from "k6";
import {addToTrend, baseUsername, options, statusIs200} from "./commons/common.js";
import {accountLogin, getJSessionIdFromResponse} from "./endpoints/login.js";
import {createClient} from "./endpoints/register.js"
import {createOrder} from "./endpoints/createOrder.js";
import {getOrder} from "./endpoints/order.js";
import {updateOrder} from "./endpoints/updateOrder.js";

export {options};

export default function () {
    var virtualUser = __VU;
    var iteration = __ITER;

    var client = virtualUser + baseUsername() + iteration;
    group("user flow - creating account", function () {
        var response = createClient(client, client);
        statusIs200(response);
        addToTrend(response);
    });

    var userJSessionId = null;
    group("user flow - user login to shop", function () {
        var response = accountLogin(client, client);
        statusIs200(response);
        userJSessionId = getJSessionIdFromResponse(response);
        addToTrend(response);
    });

    var createdOrderId = null;
    group("user flow - user create order", function () {
        var response = createOrder(userJSessionId);
        statusIs200(response);
        createdOrderId = JSON.parse(response.body).id;
        addToTrend(response);
    });

    var employeeJSessionId = null;
    group("employee flow - employee login to shop", function () {
        var response = accountLogin("employee", "test");
        statusIs200(response);
        employeeJSessionId = getJSessionIdFromResponse(response);
        addToTrend(response);
    });

    var orderWithId = null;
    group("employee flow - get order with id", function () {
        var response = getOrder(employeeJSessionId, createdOrderId);
        statusIs200(response);
        orderWithId = JSON.parse(response.body);
        addToTrend(response);
    });

    group("employee flow - employee ACCEPT order with id", function () {
        var response = updateOrder(employeeJSessionId, orderWithId);
        statusIs200(response);
        addToTrend(response);
    })
}
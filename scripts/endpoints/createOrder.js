import {check, group, sleep} from "k6";
import {addToTrend, baseUrl, now, options, randomInt, randomString, statusIs200} from "../commons/common.js";
import {currentUser} from "./currentUser.js";
import {getJSessionId} from "./login.js";
import {products} from "./products.js";
import {post} from "../utils/apiClient.js";

export {options};

export function createOrder(jSessionId) {
    var url = baseUrl() + "api/orders/";
    var payload = createOrderPayload(jSessionId);
    return post(url, payload, null, jSessionId);
}

function createOrderPayload(jSessionId) {
    var productsResponse = JSON.parse(products(jSessionId).body);
    return {
        client: JSON.parse(currentUser(jSessionId).body),
        completeDate: null,
        id: randomString(),
        items: [
            createItemPayload(productsResponse),
            createItemPayload(productsResponse)
        ],
        orderDate: now(),
        status: "DRAFT"
    };
}

function createItemPayload(productsResponse) {
    return {
        product: createProductPayload(productsResponse),
        quantity: randomInt()
    };
}

function createProductPayload(productsResponse) {
    var index = randomInt(0, productsResponse.length - 1);
    var product = productsResponse[index];
    return {
        id: product.id,
        name: product.name,
    };
}

export default function () {
    group("log to shop as client and create order", function () {
        var client = "client";
        var password = "test";
        var jSessionId = getJSessionId(client, password);
        var response = createOrder(jSessionId);
        statusIs200(response);
        addToTrend(response);
    });
}
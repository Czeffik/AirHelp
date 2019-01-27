import {check, group, sleep} from "k6";
import {addToTrend, baseUrl, baseUsername, options, statusIs200} from "../commons/common.js";
import {post} from "../utils/apiClient.js";

export {options};

export function createClient(username, password) {
    var url = baseUrl() + "api/user/register";
    var payload = createClientPayload(username, password);
    return post(url, payload);
}

function createClientPayload(username, password) {
    return {
        city: "City",
        firstName: "First",
        flatNo: 0,
        homeNo: 0,
        id: username,
        lastName: "Last",
        password: password,
        role: "CLIENT",
        street: "Street",
        username: username,
        zipCode: 0
    };
}

export default function () {
    group("register", function () {
        var virtualUser = __VU;
        var iteration = __ITER;
        var client = virtualUser + baseUsername() + iteration;
        var response = createClient(client, client);
        statusIs200(response);
        addToTrend(response);
    });
}
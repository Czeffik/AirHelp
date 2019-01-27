import {Trend} from "k6/metrics";
import {check, group, sleep} from "k6";

export let options = {
    vus: 1,
    duration: '4s',
    iterations: 1,
    thresholds: {
        transaction_time: ["avg<1000"], //todo pomysl o tym
        http_req_duration: ["avg<4000"] //todo i tym
    }

};

export let trend = new Trend("transaction_time");

export function baseUrl() {
    var hostname = __ENV.BASE_URL;
    if (hostname === undefined) {
        return "http://localhost:8080/";
    }
    return hostname;
}

export function baseUsername() {
    var username = __ENV.USER_LOGIN;
    if (username === undefined) {
        return randomString();
    }
    return username;
}

export function statusIs200(response) {
    check(response, {
        "status is 200": (response) => response.status === 200
    });
}

export function addToTrend(response) {
    trend.add(response.timings.duration);
}

export function now() {
    var date = new Date();
    var YYYY = date.getFullYear();
    var DD = date.getDate();
    var MM = (date.getMonth() + 1);

    if (DD < 10)
        DD = "0" + DD;
    if (MM < 10)
        MM = "0" + MM;

    var cur_day = YYYY + "-" + MM + "-" + DD;

    var hh = date.getHours();
    var mm = date.getMinutes();
    var ss = date.getSeconds();

    if (hh < 10)
        hh = "0" + hh;

    if (mm < 10)
        mm = "0" + mm;

    if (ss < 10)
        ss = "0" + ss;

    return cur_day + " " + hh + ":" + mm + ":" + ss;
}

export function randomString(min = 2, max = 20) {
    return Math.random().toString(36).substr(min, max);
}

export function randomInt(min = 1, max = 10) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

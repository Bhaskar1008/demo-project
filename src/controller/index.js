"use strict";
const { set } = require("express/lib/application");
const demoProjectApi = require("./demoProject-api.controller");

function proxy(obj) {
    let handler = {
        get(target, propKey, receiver) {
            const origMethod = target[propKey];
            return function (...args) {
                return origMethod.apply(obj, args);
            };
        }
    }
    console.log(`proxxy`)
    return new Proxy(obj, handler);
}

module.exports.demoProjectApi = proxy(new demoProjectApi());
module.exports.defaultHandler = (req, res) => {
    res.status(200).send("Under Construction");
};


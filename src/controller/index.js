"use strict";
const { set } = require("express/lib/application");
const amProjectApi = require("./amProject-api.controller");

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

module.exports.amProjectApi = proxy(new amProjectApi());
module.exports.defaultHandler = (req, res) => {
    res.status(200).send("Under Construction");
};


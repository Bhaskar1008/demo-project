const ErrorManager = require('../constant/error.manager');

const STATUS = require('../constant/status');
const HEADER = require('../constant/header');

/**
 * Base Controller Class. This class will be used for keeping general logic.
 */
class Controller {
    constructor() {
    }

    ok(res, result) {
        // console.log('res.header.origin', res.header.origin)
        res.status(STATUS.OK)
            .header(HEADER.CONTENT_TYPE, HEADER.JSON)
            .header('Access-Control-Allow-Origin','*')
            .send(JSON.stringify(result));
    }

    error(res, err) {
        // TODO: Uncomment below before deployment.
        res.status(err.status || STATUS.ERROR)
            .header('Access-Control-Allow-Origin','*')
            .send(ErrorManager.get(err));
    }
}

module.exports = Controller;
const { v4: uuid } = require('uuid');
const { get_async_local_storage } = require('./instance');

function async_local_storage_middleware(req, res, next) {
    const async_local_storage = get_async_local_storage();
    if (async_local_storage !== undefined) {
        let request_id = req.headers["request-id"];
        if (request_id === undefined) {
            request_id = uuid();
        }    
        const store = { request_id };
        async_local_storage.run(store, () => {
            next();
        });
    } else {
        next();
    }
}

module.exports = async_local_storage_middleware;
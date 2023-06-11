const { AsyncLocalStorage } = require('async_hooks');

let async_local_storage = undefined;

function initialize_async_local_storage() {
    if (async_local_storage === undefined) {
        async_local_storage = new AsyncLocalStorage();
    }
    return async_local_storage;
}

function get_async_local_storage() {
    return async_local_storage;
}

module.exports = {
    initialize_async_local_storage,
    get_async_local_storage,
};
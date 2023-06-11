const {
    get_async_local_storage,
    initialize_async_local_storage,
} = require('./async-local-storage/instance');

let async_local_storage = get_async_local_storage();
if (async_local_storage === undefined) {
    async_local_storage = initialize_async_local_storage();
}

console.log = proxy_factory(console.log);
console.error = proxy_factory(console.error);

function proxy_factory(fn) {

    return new Proxy(fn, {
        apply(target, thisArg, args) {
            let log_content = args;
            const store = async_local_storage.getStore();
            if (store && store.request_id) {
                log_content = [store.request_id, ...args];
            }
            target.apply(thisArg, log_content);
        }
    });

}

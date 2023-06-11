require('./async-local-storage/instance').initialize_async_local_storage();
require('./proxy-console');

const app = require('./app');

app.listen(3000, () => {
    console.log(`App is listening on PORT 3000`);
});

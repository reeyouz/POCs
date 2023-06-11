const express = require('express');
const async_local_storage_middleware = require('./async-local-storage/middleware');
const request_logger_middleware = require('./request-logger-middleware');
const { create_user } = require('./db');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async_local_storage_middleware);

app.use(request_logger_middleware);

app.get('/', (req, res, next) => {

    console.log('Route is healthy!');
    return res.status(200).json({ message: 'Healthy' });

});

app.post('/', async (req, res, next) => {

    const { body } = req;

    try {
        
        await create_user(body);

        return res.status(200).json({ created: 'OK' });

    } catch (error) {
        
        console.error(error);
        return res.status(500).json({ message: error.message });

    }

});

module.exports = app;
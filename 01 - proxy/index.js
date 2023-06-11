require('./proxy');
require('dotenv').config();

console.trace('Hello, I am trace');
console.debug('Hello, I am debug');
console.log('Hello, I am log');
console.info('Hello, I am info');
console.warn('Hello, I am warn');
console.error(new Error('Hello, I am error'));
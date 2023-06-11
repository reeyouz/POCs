const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

const ENVIRONMENT = {
    PRODUCTION: 'production',
    STAGING: 'staging',
    DEVELOPMENT: 'development',
    LOCAL: 'local',
};

const LOG_LEVEL = {
    TRACE: 'TRACE',
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
};

const EVENTS = {
    LOGGED: 'logged',
};

const event_emitter = new EventEmitter();
const write_file_stream = fs.createWriteStream(
    path.resolve(__dirname, 'errors.log'),
    { encoding: 'utf-8', flags: 'a+' },
);

event_emitter.on(EVENTS.LOGGED, (log_content, log_level) => {
    if (log_level === LOG_LEVEL.ERROR) {
        const log_to_file = log_content.slice(2);
        for (let i = 0; i < log_to_file.length; i++) {
            const current = log_to_file[i];
            if (current instanceof Error && current.stack) {
                write_file_stream.write(current.stack);
            } else {
                write_file_stream.write(`${current}`);
            }
        }
        write_file_stream.write('\n');
    }
});

console.log   = proxy_console(console.log);
console.debug = proxy_console(console.debug);
console.trace = proxy_console(console.trace);
console.info  = proxy_console(console.info);
console.warn  = proxy_console(console.warn);
console.error = proxy_console(console.error);

function proxy_console(fn) {
    return new Proxy(fn, {
        apply(target, thisArg, args) {
            const log_level = get_log_level(target);
            if (this_should_be_logged(log_level)) {
                const log_content = format_args(args, log_level);
                target.apply(thisArg, log_content);
                event_emitter.emit(EVENTS.LOGGED, log_content, log_level);
            }
        },
    });
}

function get_log_level(target) {
    const { name } = target;
    switch (name) {
        case 'trace':
            return LOG_LEVEL.TRACE;
        case 'debug':
            return LOG_LEVEL.DEBUG;
        case 'info':
            return LOG_LEVEL.INFO;
        case 'warn':
            return LOG_LEVEL.WARN;
        case 'error':
            return LOG_LEVEL.ERROR;
        case 'log':
            return LOG_LEVEL.DEBUG;
        default:
            return LOG_LEVEL.DEBUG;
    }
}

function this_should_be_logged(log_level) {
    if (process.env.NODE_ENV === ENVIRONMENT.PRODUCTION) {
        switch (log_level) {
            case LOG_LEVEL.ERROR:
            case LOG_LEVEL.WARN:
            case LOG_LEVEL.INFO:
                return true;
            case LOG_LEVEL.DEBUG:
            case LOG_LEVEL.TRACE:
                return false;
            default:
                return false;
        }
    }
    return true;
}

function format_args(args, log_level) {
    return [
        add_log_level(log_level),
        add_timestamp(),
        ...args,
    ];
}

function add_log_level(log_level) {
    return `[${log_level.padEnd(5, ' ')}]`;
}

function add_timestamp() {
    return `${new Date().toISOString()}:`;
}

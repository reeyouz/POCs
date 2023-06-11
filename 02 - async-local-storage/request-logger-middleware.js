function request_logger_middleware(req, res, next) {
    
    console.log(req.method, req.url);
    next();

}

module.exports = request_logger_middleware;

const ApiError = require('../exceptions/api_error')

module.exports = function(err, req, res, next){
    console.log(err);
    if(err instanceof ApiError){
        return res.status(err.status)
    }
}
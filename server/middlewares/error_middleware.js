const ApiError = require('../exceptions/api_error')

module.exports = function(err, req, res, next){
    console.log(err);
    //prinadlezyt li objekt err classu ApiError
    if(err instanceof ApiError){
        return res.status(err.status).json({massage: err.massage, errors: err.errors})
    }
    return res.status(500).json({message: 'Непредвиденная ошибка'})
}
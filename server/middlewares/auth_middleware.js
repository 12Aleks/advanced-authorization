const ApiError = require('../exceptions/api_error');
const tokenService =require('../service/token_service');
module.exports = function (req, res, next) {
    try{
        //poluczajem token iz headers
       const authorizationHeader = req.headers.authorization;
       if(!authorizationHeader) return next(ApiError.UnauthorizedError());

       //usalaem zagolowok Bearer iz dannych i poluczajem sam token
       const accessToken = authorizationHeader.split( ' ')[1];
       if(!accessToken) return next(ApiError.UnauthorizedError());

       const userData = tokenService.validateAccessToken(accessToken);
       if(!userData) return next(ApiError.UnauthorizedError());

       req.user = userData;
       next()
    }catch(e){
        return next(ApiError.UnauthorizedError())
    }
}
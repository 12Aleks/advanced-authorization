const userServices = require('../service/user_service');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api_error')

class UserController{
    async registration(req, res, next){
      try{
          const errors = validationResult(req);
          if(!errors.isEmpty()){
              return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
          }
          const {email, password} = req.body;
          const userData = await userServices.registration(email, password);

          //refresh token my chranim w cookach, cookie my podkluczili w index.js app.use(cookieParser());
          //w cookie - maxAge - dlitelnost zyzni cookie, httpOnly - cookie nielza menat i poluczat w seredine brauzera!!!
          res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
          return res.json(userData);
      }catch(e){
         next(e)
      }
    }

    async login(req, res, next){
        try{

        }catch(e){
            next(e)
        }
    }

    async logout(req, res, next){
        try{

        }catch(e){
            next(e)
        }
    }

    async activation(req, res, next){
        try{
          //iz stroki zaprosa poluczajem ssylku aktivacii (nazwanie link ukazano w routere)
          const activationLink = req.params.link
          await userServices.activate(activationLink);
          //posle aktivacii nuzno perevest polzowatela s servera na realnyj host dla etogo delaem redirect w express est redirect()
           return res.redirect(process.env.CLIENT_URL)
        }catch(e){
            next(e)
        }
    }


    async refresh(req, res, next){
        try{

        }catch(e){
            next(e)
        }
    }

    async getUsers(req, res, next){
        try{
         return res.json(['daat'])
        }catch(e){
            next(e)
        }
    }
}

module.exports = new UserController()
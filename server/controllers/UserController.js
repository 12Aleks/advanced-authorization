const userServices = require('../service/user_service')

class UserController{
    async registration(req, res, next){
      try{
          const {email, password} = req.body;
          const userData = await userServices.registration(email, password)
      }catch(e){

      }
    }

    async login(req, res, next){
        try{

        }catch(e){

        }
    }

    async logout(req, res, next){
        try{

        }catch(e){

        }
    }

    async activation(req, res, next){
        try{

        }catch(e){

        }
    }

    async refresh(req, res, next){
        try{

        }catch(e){

        }
    }

    async getUsers(req, res, next){
        try{
         return res.json(['daat'])
        }catch(e){

        }
    }
}

module.exports = new UserController()
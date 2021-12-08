const UserModel = require('../models/user_model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail_service'); //dla otprawki na pocztu i podtwergdenija jejo
const tokenService = require('./token_service');
const UserDto = require('../dtos/user_dto')
const ApiError = require('../exceptions/api_error')

class UserService {
    async registration(email, password) {
        const candidate = await UserModel.findOne({email});
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с ${email} уже существует в базе данных`)
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = await uuid.v4(); //ssylka dla aktiwacii

        const user = await UserModel.create({email, password: hashPassword, activationLink});

        //Funkcija dla otpravki pisma s sylkoj dla podtwergdenija akkaunta
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);


        const userDto = new UserDto(user); // id, email, isActivated
        //generirujem tokeny akcess i refresz
        const tokens = tokenService.generateToken({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto}
    }

    //Funkcija aktivacii akkaunta po ssylke poluczenoj na emeail
    async activate (activationLink) {
       //poluczajem sgenerirowanuju uuid ranee ssylku iz path po kotoromu pereszol polzowatel posle klika na swojej elektrnnoj poczte
       //i po nemu iszem jest li takoj polzowatel
        const user = await UserModel.findOne({activationLink});
        if(!user){
            throw ApiError.BadRequest('User not found')
        }
        user.isActivated = true;
        await user.save()
    }


    async login(email, password){
      const user = await UserModel.findOne({email});
      if(!user){
          throw ApiError.BadRequest('User not found')
      }

      const isPassEquals = await bcrypt.compare(password, user.password);
        if(!isPassEquals){
            throw ApiError.BadRequest('password is not correct!!!')
        }
        //udalajem iz modeli wso czto nie nuzno
        const userDto = new UserDto(user);
        const tokens = tokenService.generateToken({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async logout(refreshToken){
       const token = await tokenService.removeToken(refreshToken);
       return token
    }

    async refresh(refreshToken){
       if(!refreshToken){
           throw ApiError.UnauthorizedError()
       }

       const userData = tokenService.validateRefreshToken(refreshToken);
       const tokenFromDb = await tokenService.findToken(refreshToken);

       if(!userData || !tokenFromDb){
           throw ApiError.UnauthorizedError()
       }

        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user); // id, email, isActivated
        //generirujem tokeny akcess i refresz
        const tokens = tokenService.generateToken({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto}
    }

    async getAllUsers(){
        const users = await UserModel.find();
        return users
    }
}

module.exports = new UserService();
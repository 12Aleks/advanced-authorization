const UserModel = require('../models/user_model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail_service'); //dla otprawki na pocztu i podtwergdenija jejo
const tokenService = require('./token_service');
const UserDto = require('../dtos/user_dto')

class UserService{
  async registration(email, password){
      const candidate = await UserModel.findOne({email});
      if(candidate) {
          throw new Error(`Пользователь с ${email} уже существует в базе данных`)
      }
           const hashPassword = await bcrypt.hash(password, 3);
           const activationLink = uuid.v4(); //ssylka dla aktiwacii
           const user = await UserModel.create({email, password: hashPassword, activationLink});
           await mailService.sendActivationMail(email, activationLink);


           const userDto = new UserDto(user); // id, email, isActivated
           //generirujem tokeny akcess i refresz
           const tokens = tokenService.generateToken({...userDto});

           await tokenService.saveToken(userDto.id, tokens.refreshToken);

           return {...tokens, user: userDto}
  }
}

module.exports = new UserService();
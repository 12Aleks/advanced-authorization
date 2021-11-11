const UserModel = require('../models/user_model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail_service') //dla otprawki na pocztu i podtwergdenija jejo

class UserService{
  async registration(email, password){
     const candidate = await UserModel.findOne({email})
      if(candidate) {
          throw new Error(`Пользователь с ${email} уже существует в базе данных`)
      }
           const hashPassword = await bcrypt.hash(password, 3);
           const activationLink = uuid.v4(); //ssylka dla aktiwacii
           const user = await UserModel.create({email, password: hashPassword, activationLink})
           await mailService.sendActivationMail(email, activationLink)

  }
}

module.exports = new UserService()
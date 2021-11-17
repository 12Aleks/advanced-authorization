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
}

module.exports = new UserService();
const jwt = require('jsonwebtoken');
//model sochroniajuszaja refresh token dla konkretnogo polzowatela
const tokenModel = require('../models/token_model');

class TokenService {
    generateToken(payload) {
        //korotkowremennyj token zywuszyj na storone polzowatela
        const accessToken = jwt.sign(
            payload,
            process.env.JWT_ACCESS_SECRET_KEY,
            {expiresIn: '30m'}
        );
        //dlitelnyj token zywuszyj na storone servera
        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET_KEY,
            {expiresIn: '30d'}
        );
        return {
            accessToken, refreshToken
        }

    }

    //validacija tokena, proverka na validnost i na to czto srok godnosti ego dejstwitelen
    validateAccessToken(token){
        try{
          const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);
          return userData
        }catch(e){
          return null
        }
    }

    validateRefreshToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY);
            return userData
        }catch(e){
            return null
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({user: userId});
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }

        const token = await tokenModel.create({user: userId, refreshToken});
        return token;
    }

    async removeToken(refreshToken){
        const tokenData = await tokenModel.deleteOne({refreshToken});
        return tokenData;
    }

    async findToken(refreshToken){
        const tokenData = await tokenModel.findOne({refreshToken});
        return tokenData;
    }
}

module.exports = new TokenService();
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
        )
        //dlitelnyj token zywuszyj na storone servera
        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET_KEY,
            {expiresIn: '30d'}
        )
        return {
            accessToken, refreshToken
        }

    }
    async saveToken(userId, refreshToken){
      const tokenData = await tokenModel.findOne({user: userId});
      if(tokenData){
          tokenData.refreshToken = refreshToken;
          return tokenData.save()
      }

      const token = await tokenModel({user: userId, refreshToken})
      return token
    }
}

module.exports = new TokenService()
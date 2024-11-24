const jwt = require('jsonwebtoken');
const config = require('../config.js'); 

class AuthService {
    generateToken(user) {
        const payload = {
            sub: user._id.toString(),
            email: user.email
        };

        return jwt.sign(payload, config.jwt.secretKey, {
            expiresIn: '1h',
            issuer: config.jwt.issuer,
            audience: config.jwt.audience
        });
    }
}

module.exports = new AuthService();

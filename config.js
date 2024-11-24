module.exports = {
    jwt: {
        secretKey: process.env.JWT_SECRET_KEY || 'your-secret-key',
        issuer: process.env.JWT_ISSUER || 'your-issuer',
        audience: process.env.JWT_AUDIENCE || 'your-audience'
    }
};

import bcrypt from 'bcryptjs';
import db from '../models/index.js';
import jwt from 'jsonwebtoken';
import config from '../db/config.js';

async function authenticate(email, password_hash) {

    const userFinded = await db.models.User.findOne({
        where: { email }
    });

    if (!userFinded) {
        console.log("no existe usuario")
        return null;
    }

    const isPasswordValid = await bcrypt.compare(password_hash, userFinded.password_hash);

    delete userFinded.dataValues.password_hash;

    return isPasswordValid ? userFinded : null;
}

function generateToken(user) {
    return jwt.sign({
        user,
        iat: Math.floor(Date.now() / 1000),  // Tiempo de emisión
        exp: Math.floor(Date.now() / 1000) + (82000)  // Expiración (casi 23 horas)
    },
        config.JWT_SECRET
    );
}

function verifyToken(token) {
    try {
        return jwt.verify(token, config.JWT_SECRET);
    } catch (err) {
        console.error('Token verification error in AuthService:', err);
        throw err;
    }
}

export { authenticate, verifyToken, generateToken };

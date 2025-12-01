import bcrypt from 'bcryptjs';
import db from '../models/index.js';
import jwt from 'jsonwebtoken';
import env from '../env.js';

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
    console.log(env.jwt.expiresIn)
  return jwt.sign(
    { user },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }   
  );
}

function verifyToken(token) {
    try {
        return jwt.verify(token, env.jwt.secret);
    } catch (err) {
        console.error('Token verification error in AuthService:', err);
        throw err;
    }
}

function signUrlToken(quotationId, email) {
  return jwt.sign(
    {
      qid: quotationId,   
      email,           
    },
    env.jwt.secret,
    { expiresIn: '48h' } 
  );
}

export { authenticate, verifyToken, generateToken, signUrlToken };

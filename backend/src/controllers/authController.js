 
import { UnauthorizedError, BadRequestError, NotFoundError } from '../error/httpErrors.js';
import { authenticate, generateToken, verifyToken } from '../services/authService.js';

const login = async (req, res) => {

    const { email, password_hash } = req.body;

    if (!email || !password_hash) {
      throw new BadRequestError('Email y contraseña son requeridos');
    }
    // Authenticate User
    const user = await authenticate(email, password_hash);

    if (!user) {
        throw new UnauthorizedError('Invalid credentials');
    }

    return res.status(200).json({ token: generateToken(user) , user });
};

const me = async (req, res) => {

    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
       throw new UnauthorizedError('Token no provided');
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        throw new NotFoundError('usuario no encontrado');
    }

    const user = {/* agregar usuario*/} || {};

    /*if (!user) {
        throw new NotFoundError('usuario no encontrado');
    }*/

    return res.status(200).json({
        status: 'success',
        message: 'Información de usuario obtenida con éxito',
        statusCode: 200,
        success: true,
        message: 'Validacion Exitosa',
        user
    });


};

const logout = async (req, res) => {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Token no proporcionado');
  }

  const token = authHeader.split(' ')[1];
  // no hay columna de blacklist en la bd, asi que solo respondemos ok

  return res.status(200).json({
    status: 'success',
    success: true,
    statusCode: 200,
    message: 'Sesión cerrada correctamente',
  });
};


export { login, me, logout };
import { verifyToken } from "../services/authService.js";

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
 
    if (!authHeader) {       
        console.error('No authorization header provided');
        return res.status(401).json({ error: 'No authorization header provided' });
    }

    const token = authHeader.split(' ')[1];
  
    try {
        const user = verifyToken(token);
        req.user = user;
        next();
    } catch (err) {
        console.error('Token verification error:', err.message);
        return res.status(403).json({ error: 'Invalid token', message: err.message });
    }
};

export default authenticateJWT;
    
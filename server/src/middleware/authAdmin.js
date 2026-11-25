import jwt from 'jsonwebtoken';

export default function authAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ success: false, message: 'Token manquant.' });
  try {
    const payload = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    if (payload.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Accès réservé aux administrateurs.' });
    }
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Token invalide ou expiré.' });
  }
}
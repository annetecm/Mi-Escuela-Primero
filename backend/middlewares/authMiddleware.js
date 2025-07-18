const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "top");
    req.usuario = decoded; // { usuarioId, correo, tipo }
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token inválido." });
  }
}

module.exports =  verifyToken;

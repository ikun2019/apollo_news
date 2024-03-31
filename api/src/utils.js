const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secret';

// tokenを複合
function getTokenPayload(token) {
  const userId = jwt.verify(token, JWT_SECRET);
  return userId;
}

// userIdを取得
function getUserId(req, authToken) {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace('Bearer', "");
      if (!token) {
        throw new Error('認証されていません');
      };
      const { userId } = getTokenPayload(token);
      return userId;
    };
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken);
    return userId;
  };
  throw new Error('認証されていません');
};

module.exports = {
  JWT_SECRET,
  getUserId,
};
const getUserId = (req, res, jwt, APP_SECRET) => {
  const { authorization } = req.headers;
  return jwt.verify(authorization, APP_SECRET, (err, decoded) => {
    err && res.status(401).json("Not authorized");
    return decoded.userId;
  });
};

module.exports = getUserId;

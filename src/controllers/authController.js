
const jwt = require('jsonwebtoken');


const tokenRefresh = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({message: 'Refresh token wasn\'t provided.'});
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const newAccessToken = jwt.sign({
      id: decoded.id,
      email: decoded.email
    }, process.env.JWT_SECRET, {expiresIn: '12h'});

    return res.status(200).json({accessToken: newAccessToken});

  } catch (err) {
    res.status(403).json({message: `(${err.message}) Invalid refresh token provided. Kindly login again.`});
  }
}

module.exports = {
  tokenRefresh
}

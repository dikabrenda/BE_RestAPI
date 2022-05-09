/* eslint-disable no-console */
/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';
import Users from '../models/UserModels';

const refreshToken = async (req, res) => {
  try {
    // eslint-disable-next-line no-shadow
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.sendStatus(401);
    }
    const users = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!users) {
      return res.sendStatus(403);
    }
    // eslint-disable-next-line no-unused-vars
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, _decoded) => {
      if (err) {
        return res.sendStatus(403);
      }
      const userId = users[0].id;
      const { name } = users[0];
      const { email } = users[0];
      const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '30s',
      });
      res.json({ accessToken });
    });
  } catch (error) {
    console.log(error);
  }
};

export default refreshToken;

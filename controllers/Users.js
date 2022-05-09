/* eslint-disable no-console */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Users from '../models/UserModels';

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ['id', 'name', 'email'],
    });
    res.json(users);
  } catch (err) {
    console.log(err);
  }
};

export const paginateUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ['id', 'name', 'email'],
    });
    const message = 'success Load data';
    const status = 1;
    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit, 10);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const data = {};
    data.results = users.slice(startIndex, endIndex);

    if (endIndex < users.length) {
      data.nextPage = {
        page: page + 1,
        limit,
      };
    }
    if (startIndex > 0) {
      data.prevPage = {
        page: page - 1,
        limit,
      };
    }
    res.json({ status, message, data });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const Register = async (req, res) => {
  const {
    name, email, password, rePassword,
  } = req.body;
  if (password !== rePassword) {
    res.status(422).json({
      message: 'Password not matched',
    });
  }

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    const users = await Users.create({
      name,
      email,
      password: hashPassword,
    });
    res.status(201).json({
      status: 1,
      message: 'Success Register',
      data: users,
    });
  } catch (error) {
    console.log(error);
  }
};

export const Login = async (req, res) => {
  try {
    const users = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });
    const match = await bcrypt.compare(req.body.password, users[0].password);
    if (!match) {
      res.status(422).json({
        message: 'Wrong password',
      });
    }
    const { id } = users[0];
    const { name } = users[0];
    const { email } = users[0];
    const accessToken = jwt.sign(
      { id, name, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '30s',
      },
    );
    const refreshToken = jwt.sign(
      { id, name, email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '1d',
      },
    );
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id,
        },
      },
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    //   secure: true,
    });

    res.json({ name, email, accessToken });
  } catch (error) {
    res.status(404).json({
      message: 'Email not found',
    });
  }
};

export const Logout = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.sendStatus(204);
  const users = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!users) return res.sendStatus(204);
  const userId = users[0].id;
  await Users.update({
    refresh_token: null,
  }, {
    where: {
      id: userId,
    },
  });
  res.clearCookie('refreshToken');
  return res.sendStatus(200);
};

import express from 'express';
import {
  getUsers, Register, Login, Logout, paginateUsers,
} from '../controllers/Users';
import verifyToken from '../middleware/verfyToken';
import refreshToken from '../controllers/RefreshToken';

const router = express.Router();

router.get('/users', getUsers);
router.get('/users?page=1&limit=5', paginateUsers);
router.post('/register', Register);
router.post('/login', Login);
router.get('/token', verifyToken, refreshToken);
router.delete('/logout', verifyToken, Logout);

export default router;

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { sequelize } from '../db.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config.js';

class AuthController {
  async register(req, res) {
    const t = await sequelize.transaction();

    try {
      const { email, name, password } = req.body;

      if (!email || !name || !password) {
        return res.status(400).json({
          error: true,
          message: 'Please provide email, name, and password',
        });
      }

      const existingUser = await User.findOne({ where: { email: email } });
      if (existingUser) {
        return res.status(400).json({
          error: true,
          message: 'User with this email already exists',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create(
        {
          email,
          name,
          password_hash: hashedPassword,
          password_salt: salt,
        },
        { transaction: t },
      );

      if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN },
      );

      await t.commit();

      res.status(201).json({
        error: false,
        message: 'User registered successfully',
        token,
      });
    } catch (error) {
      await t.rollback();
      res.status(500).json({
        error: true,
        message: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: true,
          message: 'Please provide email and password',
        });
      }

      const user = await User.findOne({ where: { email: email } });
      if (!user) {
        return res.status(401).json({
          error: true,
          message: 'Invalid credentials',
        });
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash,
      );
      if (!isPasswordValid) {
        return res.status(401).json({
          error: true,
          message: 'Invalid credentials',
        });
      }

      if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN },
      );

      res.status(200).json({
        error: false,
        message: 'Login successful',
        token,
      });
    } catch (error) {
      res.status(500).json({
        error: true,
        message: error.message,
      });
    }
  }
}

export default AuthController;

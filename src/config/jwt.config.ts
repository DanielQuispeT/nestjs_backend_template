require('dotenv').config();

export const JWT_CONFIG = {
  global: true,
  secret: process.env.JWT_SECRET_KEY_ACCESS,
  signOptions: { expiresIn: '1d' },
};

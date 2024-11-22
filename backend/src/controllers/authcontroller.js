const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const { comparePassword, hashPassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/jwtUtils');
const { handleGoogleAuth } = require('../services/googleAuthService');

const prisma = new PrismaClient();

const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, name } = req.body;

  try {
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

   
    const hashedPassword = await hashPassword(password);

    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    res.status(201).json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name 
      } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during signup' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
   
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name 
      } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body; 

    if (!credential) {
      return res.status(400).json({ error: 'Credential is required' });
    }

    const user = await handleGoogleAuth(credential);

    
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    res.json({ 
      success: true,
      token, 
      user: { 
        id: user.id, 
        email: user.email,
        name: user.name,
        profileImage: user.profileImage 
      } 
    });
  } catch (error) {
    console.error('Google Auth Route Error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Authentication failed',
      message: error.message 
    });
  }
};


module.exports = { signup, login, googleAuth };
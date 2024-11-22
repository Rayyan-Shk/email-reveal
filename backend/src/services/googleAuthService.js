const { OAuth2Client } = require('google-auth-library');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const googleClient = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: 'http://localhost:5173' 
});

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
};

const handleGoogleAuth = async (credential) => {
  try {

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    
    const userInfo = {
      email: payload.email,
      name: payload.name,
      googleId: payload.sub,
      profileImage: payload.picture
    };

    let user = await prisma.user.findUnique({
      where: { googleId: userInfo.googleId }
    });

    if (!user) {
      const existingUserWithEmail = await prisma.user.findUnique({
        where: { email: userInfo.email }
      });

      if (existingUserWithEmail) {
        user = await prisma.user.update({
          where: { email: userInfo.email },
          data: { googleId: userInfo.googleId }
        });
      } else {
        user = await prisma.user.create({
          data: {
            email: userInfo.email,
            name: userInfo.name,
            googleId: userInfo.googleId,
            profileImage: userInfo.profileImage
          }
        });
      }
    }

    return user;
  } catch (error) {
    console.error('Handle Google Auth Error:', error);
    throw error;
  }
};

module.exports = { handleGoogleAuth };
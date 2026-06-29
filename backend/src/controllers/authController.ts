import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import prisma from '../config/database'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, generateTempToken, verifyTempToken } from '../utils/jwt'
import { OAuth2Client } from 'google-auth-library'
import axios from 'axios'
import { sendOTPEmail, sendWelcomeEmail } from '../services/emailService'

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// POST /api/auth/register
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body

    if (!password || password.length < 8) {
      res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' })
      return
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      res.status(400).json({ success: false, message: 'Email already registered' })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, phone, is_email_verified: false, email_verify_token: otp },
      select: { id: true, name: true, email: true, phone: true, created_at: true }
    })

    try {
      await sendOTPEmail(email, otp)
    } catch (e) {
      console.error('Failed to send OTP', e)
    }

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please verify your email.',
      data: { email }
    })
  } catch (error) {
    console.error('REGISTER ERROR:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.password) {
      res.status(401).json({ success: false, message: 'Invalid email or password' })
      return
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password' })
      return
    }

    if (!user.is_active) {
      res.status(403).json({ success: false, message: 'Account is deactivated' })
      return
    }

    if (user.is_email_verified === false) {
      res.status(403).json({ success: false, message: 'Email not verified. Please check your inbox for the OTP.' })
      return
    }

    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        user_id: user.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: { id: user.id, name: user.name, email: user.email },
        accessToken,
        refreshToken
      }
    })
  } catch (error) {
    console.error('LOGIN ERROR:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// POST /api/auth/logout
export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      res.status(400).json({ success: false, message: 'Refresh token required' })
      return
    }

    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } })

    res.json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    console.error('LOGOUT ERROR:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// POST /api/auth/verify-email
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      res.status(400).json({ success: false, message: 'Email and OTP required' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (user.is_email_verified) {
      res.status(400).json({ success: false, message: 'Email already verified' });
      return;
    }

    if (user.email_verify_token !== otp) {
      res.status(400).json({ success: false, message: 'Invalid OTP' });
      return;
    }

    // Mark as verified
    await prisma.user.update({
      where: { id: user.id },
      data: { is_email_verified: true, email_verify_token: null }
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        user_id: user.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    // Send welcome email asynchronously
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch(e) {
      console.error("Welcome email failed", e);
    }

    res.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        user: { id: user.id, name: user.name, email: user.email },
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('VERIFY EMAIL ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// POST /api/auth/refresh
export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      res.status(400).json({ success: false, message: 'Refresh token required' })
      return
    }

    const decoded = verifyRefreshToken(refreshToken)

    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } })
    if (!stored) {
      res.status(401).json({ success: false, message: 'Invalid refresh token' })
      return
    }

    if (stored.expires_at < new Date()) {
      await prisma.refreshToken.delete({ where: { token: refreshToken } })
      res.status(401).json({ success: false, message: 'Refresh token expired' })
      return
    }

    const accessToken = generateAccessToken(decoded.userId)

    res.json({ success: true, data: { accessToken } })
  } catch (error) {
    console.error('REFRESH ERROR:', error)
    res.status(401).json({ success: false, message: 'Invalid refresh token' })
  }
}

// POST /api/auth/google
export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body; // This is an access_token from frontend
    if (!token) {
      res.status(400).json({ success: false, message: 'Google token required' });
      return;
    }

    // Verify token and get user info from Google
    const { data: payload } = await axios.get<{ email: string; name: string }>('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!payload || !payload.email) {
      res.status(400).json({ success: false, message: 'Invalid Google token' });
      return;
    }

    const { email, name } = payload;

    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !user.phone) {
      const tempToken = generateTempToken({ email, name: name || 'Google User', provider: 'google' });
      res.json({
        success: true,
        requirePhone: true,
        tempToken,
        message: 'Phone number required to complete registration'
      });
      return;
    }

    if (!user.is_active) {
      res.status(403).json({ success: false, message: 'Account is deactivated' });
      return;
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        user_id: user.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    res.json({
      success: true,
      data: {
        user: { id: user.id, name: user.name, email: user.email },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('GOOGLE LOGIN ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/auth/facebook
export const facebookLogin = async (req: Request, res: Response) => {
  try {
    const { accessToken: fbAccessToken } = req.body;
    if (!fbAccessToken) {
      res.status(400).json({ success: false, message: 'Facebook token required' });
      return;
    }

    const { data } = await axios.get<{ email: string; name: string }>(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${fbAccessToken}`);
    if (!data || !data.email) {
      res.status(400).json({ success: false, message: 'Invalid Facebook token or missing email. Ensure email permission is granted.' });
      return;
    }

    const { email, name } = data;

    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !user.phone) {
      const tempToken = generateTempToken({ email, name: name || 'Facebook User', provider: 'facebook' });
      res.json({
        success: true,
        requirePhone: true,
        tempToken,
        message: 'Phone number required to complete registration'
      });
      return;
    }

    if (!user.is_active) {
      res.status(403).json({ success: false, message: 'Account is deactivated' });
      return;
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        user_id: user.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    res.json({
      success: true,
      data: {
        user: { id: user.id, name: user.name, email: user.email },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('FACEBOOK LOGIN ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/auth/complete-oauth
export const completeOAuth = async (req: Request, res: Response) => {
  try {
    const { tempToken, phone, password } = req.body;
    if (!tempToken || !phone || !password || password.length < 8) {
      res.status(400).json({ success: false, message: 'Token, phone number, and a password (min 8 chars) are required' });
      return;
    }

    let payload: any;
    try {
      payload = verifyTempToken(tempToken);
    } catch (e) {
      res.status(401).json({ success: false, message: 'Session expired. Please sign in again.' });
      return;
    }

    const { email, name, provider } = payload;
    const hashedPassword = await bcrypt.hash(password, 10);

    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      user = await prisma.user.create({
        data: { name, email, phone, is_email_verified: true, password: hashedPassword },
      });
    } else {
      user = await prisma.user.update({
        where: { email },
        data: { phone, password: hashedPassword }
      });
    }

    if (!user.is_active) {
      res.status(403).json({ success: false, message: 'Account is deactivated' });
      return;
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        user_id: user.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    res.json({
      success: true,
      message: 'Account completed successfully',
      data: {
        user: { id: user.id, name: user.name, email: user.email },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('COMPLETE OAUTH ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
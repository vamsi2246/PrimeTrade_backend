const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');
const { AuthenticationError, ApiError } = require('../utils/errors');
const AuditLogService = require('./AuditLogService');

class AuthService {
  generateAccessToken(userAccount) {
    return jwt.sign(
      { id: userAccount._id, role: userAccount.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: process.env.JWT_EXPIRE || '15m' }
    );
  }

  generateRefreshToken(userAccount) {
    const refreshSecret = process.env.JWT_REFRESH_SECRET || `${process.env.JWT_SECRET || 'fallback_secret'}_refresh`;
    return jwt.sign(
      { id: userAccount._id },
      refreshSecret,
      { expiresIn: '7d' }
    );
  }

  async register(registrationPayload, ipAddress) {
    const emailRegistered = await UserRepository.findByEmail(registrationPayload.email);
    if (emailRegistered) {
      throw new ApiError('Email already registered', 409);
    }

    const newUser = await UserRepository.create(registrationPayload);

    await AuditLogService.logAction({
      userId: newUser._id,
      action: 'USER_REGISTER',
      entity: 'User',
      entityId: newUser._id,
      ipAddress,
    });

    const sessionUser = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      isActive: newUser.isActive,
    };

    const accessToken = this.generateAccessToken(newUser);
    const refreshToken = this.generateRefreshToken(newUser);

    return { user: sessionUser, accessToken, refreshToken };
  }

  async login(email, password, ipAddress) {
    const userAccount = await UserRepository.findByEmail(email, true);
    if (!userAccount) {
      throw new AuthenticationError('Invalid credentials');
    }

    if (!userAccount.isActive) {
      throw new AuthenticationError('Account is disabled');
    }

    const isPasswordCorrect = await userAccount.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new AuthenticationError('Invalid credentials');
    }

    userAccount.lastLogin = new Date();
    await userAccount.save();

    await AuditLogService.logAction({
      userId: userAccount._id,
      action: 'USER_LOGIN',
      entity: 'User',
      entityId: userAccount._id,
      ipAddress,
    });

    const sessionUser = {
      id: userAccount._id,
      name: userAccount.name,
      email: userAccount.email,
      role: userAccount.role,
      isActive: userAccount.isActive,
      lastLogin: userAccount.lastLogin,
    };

    const accessToken = this.generateAccessToken(userAccount);
    const refreshToken = this.generateRefreshToken(userAccount);

    return { user: sessionUser, accessToken, refreshToken };
  }

  async refresh(tokenValue, ipAddress) {
    if (!tokenValue) {
      throw new AuthenticationError('Refresh token required');
    }

    try {
      const refreshSecret = process.env.JWT_REFRESH_SECRET || `${process.env.JWT_SECRET || 'fallback_secret'}_refresh`;
      const decodedToken = jwt.verify(tokenValue, refreshSecret);

      const userAccount = await UserRepository.findById(decodedToken.id);
      if (!userAccount) {
        throw new AuthenticationError('User no longer exists');
      }

      if (!userAccount.isActive) {
        throw new AuthenticationError('User account is disabled');
      }

      const accessToken = this.generateAccessToken(userAccount);
      const newRefreshToken = this.generateRefreshToken(userAccount);

      await AuditLogService.logAction({
        userId: userAccount._id,
        action: 'TOKEN_REFRESH',
        entity: 'User',
        entityId: userAccount._id,
        ipAddress,
      });

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new AuthenticationError('Invalid or expired refresh token');
    }
  }

  async logout(userId, ipAddress) {
    if (userId) {
      await AuditLogService.logAction({
        userId,
        action: 'USER_LOGOUT',
        entity: 'User',
        entityId: userId,
        ipAddress,
      });
    }
    return true;
  }
}

module.exports = new AuthService();

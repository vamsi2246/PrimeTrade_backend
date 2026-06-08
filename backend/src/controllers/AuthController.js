const AuthService = require('../services/AuthService');
const { successResponse } = require('../utils/response');

const setRefreshTokenCookie = (res, tokenValue) => {
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };
  res.cookie('refresh_token', tokenValue, cookieOptions);
};

const register = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await AuthService.register(
      req.body,
      req.ip
    );

    setRefreshTokenCookie(res, refreshToken);

    return successResponse(res, 201, 'User registered successfully', {
      user,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await AuthService.login(
      email,
      password,
      req.ip
    );

    setRefreshTokenCookie(res, refreshToken);

    return successResponse(res, 200, 'Login successful', {
      user,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

const googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    const { user, accessToken, refreshToken } = await AuthService.googleLogin(
      idToken,
      req.ip
    );

    setRefreshTokenCookie(res, refreshToken);

    return successResponse(res, 200, 'Login successful via Google', {
      user,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const refreshTokenValue = req.cookies.refresh_token;
    const { accessToken, refreshToken: newRefreshToken } = await AuthService.refresh(
      refreshTokenValue,
      req.ip
    );

    setRefreshTokenCookie(res, newRefreshToken);

    return successResponse(res, 200, 'Token refreshed successfully', {
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    await AuthService.logout(userId, req.ip);

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    return successResponse(res, 200, 'Logout successful');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  googleLogin,
  refresh,
  logout,
};

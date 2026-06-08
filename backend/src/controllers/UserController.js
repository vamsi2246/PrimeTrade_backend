const UserService = require('../services/UserService');
const { successResponse } = require('../utils/response');

const getProfile = async (req, res, next) => {
  try {
    const userAccount = await UserService.getUserProfile(req.user.id);
    return successResponse(res, 200, 'Profile fetched successfully', { user: userAccount });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userAccount = await UserService.updateProfile(req.user.id, req.body, req.ip);
    return successResponse(res, 200, 'Profile updated successfully', { user: userAccount });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const { items, total } = await UserService.getAllUsers(req.query);
    return successResponse(res, 200, 'Users retrieved successfully', {
      users: items,
      total,
    });
  } catch (error) {
    next(error);
  }
};

const changeRole = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const { role } = req.body;
    const adminUserId = req.user.id;

    const userAccount = await UserService.changeRole(targetUserId, role, adminUserId, req.ip);
    return successResponse(res, 200, `User role changed to ${role} successfully`, { user: userAccount });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const adminUserId = req.user.id;

    await UserService.deleteUser(targetUserId, adminUserId, req.ip);
    return successResponse(res, 200, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAllUsers,
  changeRole,
  deleteUser,
};

const UserRepository = require('../repositories/UserRepository');
const { NotFoundError, ApiError } = require('../utils/errors');
const AuditLogService = require('./AuditLogService');

class UserService {
  async getUserProfile(userId) {
    const userAccount = await UserRepository.findById(userId);
    if (!userAccount) {
      throw new NotFoundError('User not found');
    }
    return userAccount;
  }

  async updateProfile(userId, profileUpdatePayload, ipAddress) {
    const userAccount = await UserRepository.findById(userId);
    if (!userAccount) {
      throw new NotFoundError('User not found');
    }

    if (profileUpdatePayload.email && profileUpdatePayload.email !== userAccount.email) {
      const emailTaken = await UserRepository.findByEmail(profileUpdatePayload.email);
      if (emailTaken) {
        throw new ApiError('Email is already in use', 409);
      }
    }

    delete profileUpdatePayload.role;
    delete profileUpdatePayload.isActive;

    const updatedUser = await UserRepository.update(userId, profileUpdatePayload);

    await AuditLogService.logAction({
      userId,
      action: 'USER_UPDATE_PROFILE',
      entity: 'User',
      entityId: userId,
      ipAddress,
    });

    return updatedUser;
  }

  async getAllUsers(paginationParams = {}) {
    const pageNumber = parseInt(paginationParams.page) || 1;
    const limitPerPage = parseInt(paginationParams.limit) || 10;
    return await UserRepository.findAllUsers({ page: pageNumber, limit: limitPerPage });
  }

  async changeRole(targetUserId, assignedRole, adminUserId, ipAddress) {
    if (targetUserId === adminUserId) {
      throw new ApiError('You cannot change your own role', 400);
    }

    const userAccount = await UserRepository.findById(targetUserId);
    if (!userAccount) {
      throw new NotFoundError('User not found');
    }

    userAccount.role = assignedRole;
    await userAccount.save();

    await AuditLogService.logAction({
      userId: adminUserId,
      action: `ADMIN_CHANGE_ROLE_${assignedRole.toUpperCase()}`,
      entity: 'User',
      entityId: targetUserId,
      ipAddress,
    });

    return userAccount;
  }

  async deleteUser(targetUserId, adminUserId, ipAddress) {
    if (targetUserId === adminUserId) {
      throw new ApiError('You cannot delete your own admin account', 400);
    }

    const userAccount = await UserRepository.findById(targetUserId);
    if (!userAccount) {
      throw new NotFoundError('User not found');
    }

    await UserRepository.delete(targetUserId);

    await AuditLogService.logAction({
      userId: adminUserId,
      action: 'ADMIN_DELETE_USER',
      entity: 'User',
      entityId: targetUserId,
      ipAddress,
    });

    return true;
  }
}

module.exports = new UserService();

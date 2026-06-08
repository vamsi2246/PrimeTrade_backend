const User = require('../models/User');

class UserRepository {
  async create(userPayload) {
    const newUser = new User(userPayload);
    return await newUser.save();
  }

  async findById(userId) {
    return await User.findById(userId).exec();
  }

  async findByEmail(email, includePassword = false) {
    let query = User.findOne({ email });
    if (includePassword) {
      query = query.select('+password');
    }
    return await query.exec();
  }

  async update(userId, profileUpdatePayload) {
    return await User.findByIdAndUpdate(userId, profileUpdatePayload, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async delete(userId) {
    return await User.findByIdAndDelete(userId).exec();
  }

  async findAllUsers({ page = 1, limit = 10 } = {}) {
    const skipOffset = (page - 1) * limit;
    const items = await User.find()
      .sort({ createdAt: -1 })
      .skip(skipOffset)
      .limit(limit)
      .exec();

    const total = await User.countDocuments().exec();
    return { items, total };
  }
}

module.exports = new UserRepository();

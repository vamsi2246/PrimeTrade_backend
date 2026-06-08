const Task = require('../models/Task');

class TaskRepository {
  async create(taskPayload) {
    const newTask = new Task(taskPayload);
    return await newTask.save();
  }

  async findById(taskId) {
    return await Task.findById(taskId).exec();
  }

  async update(taskId, updateFieldsPayload) {
    return await Task.findByIdAndUpdate(taskId, updateFieldsPayload, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async softDelete(taskId, userSessionId) {
    return await Task.findByIdAndUpdate(taskId, {
      isDeleted: true,
      updatedBy: userSessionId,
    }).exec();
  }

  async findTasks(queryFilters = {}, queryOptions = {}) {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      search = '',
    } = queryOptions;

    const dbFilters = { ...queryFilters, isDeleted: false };

    if (search) {
      dbFilters.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skipOffset = (parseInt(page) - 1) * parseInt(limit);
    const parsedLimit = parseInt(limit);

    const items = await Task.find(dbFilters)
      .sort(sort)
      .skip(skipOffset)
      .limit(parsedLimit)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .exec();

    const total = await Task.countDocuments(dbFilters).exec();

    return {
      items,
      total,
      page: parseInt(page),
      limit: parsedLimit,
      totalPages: Math.ceil(total / parsedLimit),
    };
  }

  async countTasks(queryFilters = {}) {
    return await Task.countDocuments({ ...queryFilters, isDeleted: false }).exec();
  }

  async getTaskStats(queryFilters = {}) {
    const dbFilters = { ...queryFilters, isDeleted: false };

    const statusAggregate = await Task.aggregate([
      { $match: dbFilters },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const priorityAggregate = await Task.aggregate([
      { $match: dbFilters },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    const totalCount = await Task.countDocuments(dbFilters).exec();

    const statsSummary = {
      total: totalCount,
      pending: 0,
      in_progress: 0,
      completed: 0,
      lowPriority: 0,
      mediumPriority: 0,
      highPriority: 0,
    };

    statusAggregate.forEach((item) => {
      if (item._id === 'pending') statsSummary.pending = item.count;
      if (item._id === 'in_progress') statsSummary.in_progress = item.count;
      if (item._id === 'completed') statsSummary.completed = item.count;
    });

    priorityAggregate.forEach((item) => {
      if (item._id === 'low') statsSummary.lowPriority = item.count;
      if (item._id === 'medium') statsSummary.mediumPriority = item.count;
      if (item._id === 'high') statsSummary.highPriority = item.count;
    });

    return statsSummary;
  }
}

module.exports = new TaskRepository();

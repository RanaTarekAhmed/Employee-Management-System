const Notification = require("../models/notification-model");

// Get all notifications
const getAllNotifications = async (req, res) => {
  try {
    const excludeFields = [
      "__v",
      "createdAt",
      "updatedAt",
      "page",
      "limit",
      "sort",
      "fields",
    ];

    const excludeQuery = { ...req.query };

    excludeFields.forEach((field) => delete excludeQuery[field]);

    Object.keys(excludeQuery).forEach((key) => {
      if (/^(.+)\[(gte|gt|lte|lt)\]$/.test(key)) {
        delete excludeQuery[key];
      }
    });

    console.log("Query parameters:", req.query);
    console.log("Excluded query parameters:", excludeQuery);

    const range = queryRange(req.query);

    let query = Notification.find({
      ...excludeQuery,
      ...range,
    }).populate("employee", "firstName lastName email");

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Field Selection
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    const notifications = await query;

    res.status(200).json({
      status: "success",
      count: notifications.length,
      page,
      results: notifications.length,
      data: {
        notifications,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to fetch notifications: ${error.message}`,
    });
  }
};
// Create notification
const createNotification = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const notification = await Notification.create(req.body);

    res.status(201).json({
      status: "success",
      message: "Notification created successfully",
      data: {
        notification,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to create notification: ${error.message}`,
    });
  }
};

// Get notification by ID
const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id).populate(
      "employee",
      "firstName lastName email"
    );

    if (!notification) {
      return res.status(404).json({
        status: "error",
        message: "Notification not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        notification,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to fetch notification: ${error.message}`,
    });
  }
};

// Update notification
const updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        status: "error",
        message: "Notification not found",
      });
    }

    const updatedNotification = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("employee", "firstName lastName email");

    res.status(200).json({
      status: "success",
      message: "Notification updated successfully",
      data: {
        notification: updatedNotification,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to update notification: ${error.message}`,
    });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id).populate(
      "employee",
      "firstName lastName email"
    );

    if (!notification) {
      return res.status(404).json({
        status: "error",
        message: "Notification not found",
      });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      message: "Notification deleted successfully",
      data: {
        notification,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to delete notification: ${error.message}`,
    });
  }
};

// Range Query Helper
function queryRange(query) {
  const filtered = {};

  for (let key in query) {
    const value = query[key];
    const match = key.match(/^(.+)\[(gte|gt|lte|lt)\]$/);

    if (match) {
      const field = match[1];
      const operator = `$${match[2]}`;

      if (!filtered[field]) {
        filtered[field] = {};
      }

      filtered[field][operator] = Number(value);
    }
  }

  return filtered;
}

module.exports = {
  getAllNotifications,
  createNotification,
  getNotificationById,
  updateNotification,
  deleteNotification,
};
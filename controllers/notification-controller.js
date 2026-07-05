const Notification = require("../models/notification-model");

// Get all notifications
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().populate(
      "employee",
      "firstName lastName email"
    );

    res.status(200).json({
      status: "success",
      count: notifications.length,
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
        status: "fail",
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
      message: error.message,
    });
  }
};

// Update notification
const updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!notification) {
      return res.status(404).json({
        status: "fail",
        message: "Notification not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Notification updated successfully",
      data: {
        notification,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({
        status: "fail",
        message: "Notification not found",
      });
    }

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
      message: error.message,
    });
  }
};

module.exports = {
  getAllNotifications,
  createNotification,
  getNotificationById,
  updateNotification,
  deleteNotification,
};
const Performance = require("../models/performance-model");

// Get all performance reviews
const getAllPerformances = async (req, res) => {
  try {
    const performances = await Performance.find().populate(
      "employee",
      "firstName lastName email department"
    );

    res.status(200).json({
      status: "success",
      count: performances.length,
      data: {
        performances,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to fetch performance reviews: ${error.message}`,
    });
  }
};

// Create performance review
const createPerformance = async (req, res) => {
  try {
    const performance = await Performance.create(req.body);

    res.status(201).json({
      status: "success",
      message: "Performance review created successfully",
      data: {
        performance,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to create performance review: ${error.message}`,
    });
  }
};

// Get performance by ID
const getPerformanceById = async (req, res) => {
  try {
    const performance = await Performance.findById(req.params.id).populate(
      "employee",
      "firstName lastName email department"
    );

    if (!performance) {
      return res.status(404).json({
        status: "fail",
        message: "Performance review not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        performance,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Update performance
const updatePerformance = async (req, res) => {
  try {
    const performance = await Performance.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!performance) {
      return res.status(404).json({
        status: "fail",
        message: "Performance review not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Performance updated successfully",
      data: {
        performance,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Delete performance
const deletePerformance = async (req, res) => {
  try {
    const performance = await Performance.findByIdAndDelete(req.params.id);

    if (!performance) {
      return res.status(404).json({
        status: "fail",
        message: "Performance review not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Performance deleted successfully",
      data: {
        performance,
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
  getAllPerformances,
  createPerformance,
  getPerformanceById,
  updatePerformance,
  deletePerformance,
};
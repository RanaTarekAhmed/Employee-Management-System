const Performance = require("../models/performance-model");

// Get all performance reviews
const getAllPerformances = async (req, res) => {
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

    let query = Performance.find({
      ...excludeQuery,
      ...range,
    }).populate("employee", "firstName lastName email department");

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

    const performances = await query;

    res.status(200).json({
      status: "success",
      count: performances.length,
      page,
      results: performances.length,
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
    console.log("Request body:", req.body);

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
        status: "error",
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
      message: `Failed to fetch performance review: ${error.message}`,
    });
  }
};

// Update performance
const updatePerformance = async (req, res) => {
  try {
    const performance = await Performance.findById(req.params.id);

    if (!performance) {
      return res.status(404).json({
        status: "error",
        message: "Performance review not found",
      });
    }

    const updatedPerformance = await Performance.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("employee", "firstName lastName email department");

    res.status(200).json({
      status: "success",
      message: "Performance updated successfully",
      data: {
        performance: updatedPerformance,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to update performance: ${error.message}`,
    });
  }
};

// Delete performance
const deletePerformance = async (req, res) => {
  try {
    const performance = await Performance.findById(req.params.id).populate(
      "employee",
      "firstName lastName email department"
    );

    if (!performance) {
      return res.status(404).json({
        status: "error",
        message: "Performance review not found",
      });
    }

    await Performance.findByIdAndDelete(req.params.id);

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
      message: `Failed to delete performance: ${error.message}`,
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
  getAllPerformances,
  createPerformance,
  getPerformanceById,
  updatePerformance,
  deletePerformance,
};
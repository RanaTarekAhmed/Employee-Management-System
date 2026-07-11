const Attendance = require("../models/attendance-model");

// Get all attendance records
const getAllAttendance = async (req, res) => {
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

    let query = Attendance.find({
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

    const attendance = await query;

    res.status(200).json({
      status: "success",
      count: attendance.length,
      page,
      data: {
        attendance,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to fetch attendance records: ${error.message}`,
    });
  }
};

// Create attendance record
const createAttendance = async (req, res) => {
  try {
    if (req.body.status) {
      req.body.status = req.body.status.toLowerCase();
    }

    console.log("Request body:", req.body);

    const attendance = await Attendance.create(req.body);

    res.status(201).json({
      status: "success",
      message: "Attendance record created successfully",
      data: {
        attendance,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to create attendance record: ${error.message}`,
    });
  }
};

// Get attendance by ID
const getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id).populate(
      "employee",
      "firstName lastName email department"
    );

    if (!attendance) {
      return res.status(404).json({
        status: "error",
        message: "Attendance record not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        attendance,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to fetch attendance record: ${error.message}`,
    });
  }
};

// Update attendance
const updateAttendance = async (req, res) => {
  try {
    if (req.body.status) {
      req.body.status = req.body.status.toLowerCase();
    }

    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        status: "error",
        message: "Attendance record not found",
      });
    }

    const updatedAttendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("employee", "firstName lastName email department");

    res.status(200).json({
      status: "success",
      message: "Attendance updated successfully",
      data: {
        attendance: updatedAttendance,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to update attendance: ${error.message}`,
    });
  }
};

// Delete attendance
const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id).populate(
      "employee",
      "firstName lastName email department"
    );

    if (!attendance) {
      return res.status(404).json({
        status: "error",
        message: "Attendance record not found",
      });
    }

    await Attendance.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      message: "Attendance deleted successfully",
      data: {
        attendance,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to delete attendance: ${error.message}`,
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
  getAllAttendance,
  createAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
};
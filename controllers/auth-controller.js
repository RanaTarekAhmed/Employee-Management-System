const User = require('../models/user-model');
const generateToken = require('../utils/get-jwt');
const deleteUploadedFile = require('../utils/delete-uploaded-file');

const signup = async (req, res) => {
  try {
    const user = await User.create({
      ...req.body,
      role: 'employee',
      imageURL: req.file ? req.file.filename : 'default.jpg'
    });

    const token = generateToken(user);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  } catch (error) {
    if (req.file) {
      deleteUploadedFile('users', req.file.filename);
    }

    res.status(400).json({
      status: 'fail',
      message: 'Error signing up user',
      error: error.message
    });
  }
};

module.exports = {
  signup
};
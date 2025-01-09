// controllers/classController.js
const Class = require('../models/Class');


// Create a new class
const createClass = async (req, res) => {
  try {
    const { className, year, teacher, studentFees, maxStudents } = req.body;

    // Check if the class already exists
    const existingClass = await Class.findOne({ className });
    if (existingClass) {
      return res.status(400).json({ message: 'Class already exists.' });
    }

    // Create a new class
    const newClass = new Class({ className, year, teacher, studentFees, maxStudents });
    await newClass.save();

    res.status(201).json(newClass);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.', error: err.message });
  }
};

// Get all classes
const getClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('teacher students');
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.', error: err.message });
  }
};

// Update a class
const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { className, year, teacher, studentFees, maxStudents } = req.body;

    const updatedClass = await Class.findByIdAndUpdate(
      id,
      { className, year, teacher, studentFees, maxStudents },
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found.' });
    }

    res.json(updatedClass);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.', error: err.message });
  }
};

// Delete a class
const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedClass = await Class.findByIdAndDelete(id);
    if (!deletedClass) {
      return res.status(404).json({ message: 'Class not found.' });
    }

    res.json({ message: 'Class deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.', error: err.message });
  }
};

// Get class details by ID
const getClassDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const classDetails = await Class.findById(id).populate('teacher students');
    if (!classDetails) {
      return res.status(404).json({ message: 'Class not found.' });
    }
    res.json(classDetails);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.', error: err.message });
  }
};

module.exports = { createClass, getClasses, updateClass, deleteClass, getClassDetails};
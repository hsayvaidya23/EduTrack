// controllers/teacherController.js
const Teacher = require('../models/Teacher');

// Create a new teacher
const createTeacher = async (req, res) => {
  try {
    const { name, gender, dob, contactDetails, salary, assignedClass } = req.body;

    const newTeacher = new Teacher({ name, gender, dob, contactDetails, salary, assignedClass });
    await newTeacher.save();

    res.status(201).json(newTeacher);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.', error: err.message });
  }
};

// Get all teachers
const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('name');
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.', error: err.message });
  }
};

// Update a teacher
const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, gender, dob, contactDetails, salary, assignedClass } = req.body;

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      id,
      { name, gender, dob, contactDetails, salary, assignedClass },
      { new: true }
    );

    if (!updatedTeacher) {
      return res.status(404).json({ message: 'Teacher not found.' });
    }

    res.json(updatedTeacher);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.', error: err.message });
  }
};

// Delete a teacher
const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTeacher = await Teacher.findByIdAndDelete(id);
    if (!deletedTeacher) {
      return res.status(404).json({ message: 'Teacher not found.' });
    }

    res.json({ message: 'Teacher deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.', error: err.message });
  }
};

module.exports = { createTeacher, getTeachers, updateTeacher, deleteTeacher };
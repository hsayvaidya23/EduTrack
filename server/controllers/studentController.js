// controllers/studentController.js
const Student = require('../models/Student');

// Create a new student
const createStudent = async (req, res) => {
  try {
    const { name, gender, dob, contactDetails, feesPaid, class: classId } = req.body;

    const newStudent = new Student({ name, gender, dob, contactDetails, feesPaid, class: classId });
    await newStudent.save();

    res.status(201).json(newStudent);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.', error: err.message });
  }
};

// Get all students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('class');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.', error: err.message });
  }
};

// Update a student
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, gender, dob, contactDetails, feesPaid, class: classId } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, gender, dob, contactDetails, feesPaid, class: classId },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.', error: err.message });
  }
};

// Delete a student
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    res.json({ message: 'Student deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.', error: err.message });
  }
};

module.exports = { createStudent, getStudents, updateStudent, deleteStudent };
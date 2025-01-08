const express = require('express');
const {
  createStudent,
  getStudents,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new student (Admin only)
router.post('/', authMiddleware(['admin']), createStudent);

// Get all students (Admin, Teacher)
router.get('/', authMiddleware(['admin', 'teacher']), getStudents);

// Update a student (Admin only)
router.put('/:id', authMiddleware(['admin']), updateStudent);

// Delete a student (Admin only)
router.delete('/:id', authMiddleware(['admin']), deleteStudent);

module.exports = router;
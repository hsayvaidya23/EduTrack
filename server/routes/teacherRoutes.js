const express = require('express');
const {
  createTeacher,
  getTeachers,
  updateTeacher,
  deleteTeacher,
} = require('../controllers/teacherController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new teacher (Admin only)
router.post('/', authMiddleware(['admin']), createTeacher);

// Get all teachers (Admin, Teacher)
router.get('/', authMiddleware(['admin', 'teacher']), getTeachers);

// Update a teacher (Admin only)
router.put('/:id', authMiddleware(['admin']), updateTeacher);

// Delete a teacher (Admin only)
router.delete('/:id', authMiddleware(['admin']), deleteTeacher);

module.exports = router;
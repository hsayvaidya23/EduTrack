const express = require('express');
const {
  createClass,
  getClasses,
  updateClass,
  deleteClass,
  getClassDetails
} = require('../controllers/classController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new class (Admin only)
router.post('/', authMiddleware(['admin']), createClass);

// Get all classes (Admin, Teacher, Student)
router.get('/', authMiddleware(['admin', 'teacher', 'student']), getClasses);

// Get class details by ID (Admin, Teacher, Student)
router.get('/:id', authMiddleware(['admin', 'teacher', 'student']), getClassDetails);

// Update a class (Admin only)
router.put('/:id', authMiddleware(['admin']), updateClass);

// Delete a class (Admin only)
router.delete('/:id', authMiddleware(['admin']), deleteClass);

module.exports = router;
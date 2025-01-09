const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  className: { type: String, required: true, unique: true }, // Name of the class
  year: { type: Number, required: true }, // Academic year
  teacher: { type: String, ref: 'Teacher', required: false }, // Assigned teacher
  studentFees: { type: Number, required: true }, // Fees for the class
  maxStudents: { type: Number, default: 30 }, // Maximum number of students allowed
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }], // List of students in the class
});

module.exports = mongoose.model('Class', ClassSchema);
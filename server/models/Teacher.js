const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Teacher's name
  gender: { type: String, required: true }, // Gender (e.g., Male, Female, Other)
  dob: { type: Date, required: false }, // Date of birth
  contactDetails: { type: String, required: true }, // Contact information
  salary: { type: Number, required: true }, // Salary of the teacher
  assignedClass: { type: String, ref: 'class', required: false }, // Class assigned to the teacher
});

module.exports = mongoose.model('Teacher', TeacherSchema);
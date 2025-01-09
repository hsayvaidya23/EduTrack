const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Student's name
  gender: { type: String, required: true }, // Gender (e.g., Male, Female, Other)
  dob: { type: Date, required: true }, // Date of birth
  contactDetails: { type: String, required: true }, // Contact information
  feesPaid: { type: Number, required: true }, // Fees paid by the student
  class: { type: String, required: false }, // Class the student belongs to
});

module.exports = mongoose.model('Student', StudentSchema);
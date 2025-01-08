// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'teacher', 'student'], required: true },
  name: { type: String },
  gender: { type: String },
  dob: { type: Date },
  contactDetails: { type: String },
  salary: { type: Number }, // For teachers
  feesPaid: { type: Number }, // For students
  assignedClass: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' }, // For teachers and students
});

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);
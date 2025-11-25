import mongoose from 'mongoose'

const schoolSchema = new mongoose.Schema({
  schoolName: String,
  schId: {type: Number, unique:true},
  email: { type: String, unique: true },
  password: String,
  // confirmPassword: String,
  schoolType: { type: String, enum: ['stateBoard', 'CBSE'] },
  defaultSubjects: [String]
});

const school = mongoose.model('School', schoolSchema);

export default school

import mongoose from 'mongoose'


const studentSchema = new mongoose.Schema({
  studentId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  schClass: { type: String },
  section: { type: String },
  contact: { type: String },
  subjects: [
    {
      subjectName: { type: String, required: true },
      marks: { type: Number, required: true },
      maxMarks: { type: Number, default: 100 }
    }
  ],
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  }
});




const student = mongoose.model('Student', studentSchema);

export default student
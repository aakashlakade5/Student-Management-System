import express from 'express';
const router = express.Router();
import School from '../models/School.js';
import Student from '../models/students-add.js';
import { checkAuth } from '../middleware/auth.js';
import { homeValid } from '../middleware/auth.js';


router.get('/', homeValid, (req, res) => {
  res.render('home');
});

router.get('/dashboard', checkAuth, async (req, res) => {
  try {
    if (!req.session.schoolId) {
      return res.status(401).send('Unauthorized: Please log in first');
    }

    const school = await School.findById(req.session.schoolId);
    if (!school) {
      return res.status(404).send('School not found');
    }

    const count = await Student.countDocuments({ schoolId: req.session.schoolId });
    const student = await Student.find({ schoolId: req.session.schoolId });

    let totalPercentage = 0;

    student.forEach(s => {
      let totalMarks = 0;
      let totalMax = 0;

      s.subjects.forEach(sub => {
        totalMarks += sub.marks;
        totalMax += sub.maxMarks;
      });
      
      let percentage = totalMax > 0 ? (totalMarks / totalMax) * 100 : 0;
      totalPercentage += percentage;



    })
    const averagePercentage = count > 0 ? (totalPercentage / count).toFixed(2) : 0;
    res.render('dashboard', { schoolName: school.schoolName, studentCount: count, schoolPerformance: averagePercentage });
  } catch (err) {
    console.error('❌ Dashboard error:', err.message);
    res.status(500).send('Error loading dashboard');
  }
});

export default router;

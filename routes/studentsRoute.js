import express from 'express'
const router = express.Router()
import { studentValidationRules, validate } from '../middleware/validators.js';
import { checkAuth } from '../middleware/auth.js';

import { 
    addStudentPage,
    addStudent,
    viewStudents,
    view1Student,
    updateStudentPage,
    updateStudent,
    deleteStudent
 } from "../controllers/studentController.js";

// Add Students
router.get('/add-student',checkAuth, addStudentPage)

router.post('/add-student', studentValidationRules, validate, addStudent);

// View Students
router.get('/view-students',checkAuth, viewStudents)


// View only one Students
router.get('/view-students/view-1-student/:id',checkAuth, view1Student)

// Update/Edit Students
router.get('/update-student/:id',checkAuth, updateStudentPage)

router.post('/update-student/:id', studentValidationRules, validate, updateStudent)

// Delete Students
router.get('/delete-student/:id',checkAuth, deleteStudent)


export default router
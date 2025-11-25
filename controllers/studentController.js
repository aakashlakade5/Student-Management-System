import Student from '../models/students-add.js'
import School from '../models/School.js'
import mongoose from 'mongoose'
import { query } from 'express-validator';
import student from '../models/students-add.js';


// Add students
export const addStudentPage = async (req, res) => {
  const school = await School.findById(req.session.schoolId);
  res.render('students/add-student', {
    subjects: school.defaultSubjects,
    error_msg: req.flash('error_msg'),
    success_msg: req.flash('success_msg')
  })
}

export const addStudent = async (req, res) => {
  try {
    // 🔹 Extract student details from request body
    const { name, schClass, section, contact } = req.body;

    // 🔹 Get current school ID from session
    const schoolId = req.session.schoolId;

    // 🔹 Fetch school details to access schId and defaultSubjects
    const school = await School.findById(schoolId);
    const schId = school.schId;

    // 🔹 Find the latest student added in this school to determine next serial
    const latestStudent = await Student.findOne({ schoolId }).sort({ _id: -1 });

    // 🔹 Calculate next serial number for studentId
    let nextNumber = 1;
    if (latestStudent) {
      const lastId = latestStudent.studentId; // e.g. S2-25-007
      const lastNum = parseInt(lastId.split('-')[2]); // Extract "007" → 7
      nextNumber = lastNum + 1; // Increment → 8
    }

    // 🔹 Format studentId as S<schId>-<year>-<serial>
    const paddedNum = String(nextNumber).padStart(3, '0'); // "008"
    const year = new Date().getFullYear().toString().slice(-2); // "25"
    const newStudentId = `S${schId}-${year}-${paddedNum}`; // e.g. S2-25-008

    // 🔹 Prepare subject array from school's defaultSubjects
    const subjects = school.defaultSubjects;
    const subject = [];

    subjects.forEach(sub => {
      const marks = Number(req.body[`marks${sub}`]) || 0;
      subject.push({ subjectName: sub, marks, maxMarks: 100 });
    });

    // 🔹 Create new student document
    const newStudent = new Student({
      studentId: newStudentId,
      name,
      schClass,
      section,
      contact,
      subjects: subject,
      schoolId
    });

    // 🔹 Save to database and redirect
    await newStudent.save();
    req.flash('success_msg', 'Student added successfully!');
    res.redirect('/view-students');

    // Optional: JSON response (commented out)
    // res.status(201).json({ message: "Student record saved successfully!" });

  } catch (errors) {
    // 🔹 Handle errors and redirect to form
    console.log(errors);
    req.flash('error_msg', 'Something went wrong');
    res.redirect('/add-student');
  }
};


// View Students
export const viewStudents = async (req, res) => {

  const { search, schClass, section, page = 1 } = req.query
  const limit = 10;
  const skip = (page - 1) * limit;
  const schoolId = req.session.schoolId;
  let query = { schoolId }
  // 🔍 Search by name
  if (search) {
    const regex = new RegExp(search, 'i'); // case-insensitive
    query.$or = [
      { name: regex },
      { studentId: regex },
      { schClass: regex },
      { section: regex }
    ];
  }

  // 🔍 Search by Class and Section
  if (schClass) query.schClass = schClass;
  if (section) query.section = section;

  const totalData = await Student.countDocuments(query);
  const students = await Student.find(query).skip(skip).limit(limit)
  const totalPages = Math.ceil(totalData / limit);


  
  
  
  
  // for Single Student
  // View only one Students
  const studentId = mongoose.Types.ObjectId.isValid(req.params.id);
  
   // 🔍 Optional: Load one student if studentId is passed
   let oneStudent = null;
   if (studentId && mongoose.Types.ObjectId.isValid(studentId)) {
     oneStudent = await Student.findOne({ _id: studentId, schoolId });
   }


   
    // res.send("Hello World")
    
    res.render('students/view-students', {
      students,
      oneStudent,
      currentPage: parseInt(page),
      totalPages,
      skip,
      filters: { search, schClass, section },
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg'),
    });
  
}


// View only one Students
export const view1Student = async (req, res) => {
  const paramsID = mongoose.Types.ObjectId.isValid(req.params.id);

  if (!paramsID) {
    return res.status(404).render('errorHandling/404', {
      title: '📃 Page Not Found',
      message: 'Oops! The page you are looking for does not exist.'
    });
  }

  try {
    const student = await Student.findById({ _id: req.params.id, schoolId: req.session.schoolId });

    if (!student) {
      return res.status(404).render('errorHandling/404', {
        title: '👨‍🎓 Student Not Found',
        message: 'Oops! The student you are looking for does not exist.'
      });
    }

    res.render('students/view-1-student', { student: student });
  } catch (error) {
    res.status(500).render('errorHandling/500', {
      title: 'Error code 500',
      message: error.message
    });
  }
};


// Update/Edit Students
export const updateStudentPage = async (req, res) => {
  const paramsID = mongoose.Types.ObjectId.isValid(req.params.id)

  if (!paramsID) {
    return res.status(404).render('errorHandling/404', {
      title: '📃 Page Not Found',
      message: 'Oops! The page you are looking for does not exist.'
    });
  }

  try {
    const student = await Student.findById({ _id: req.params.id, schoolId: req.session.schoolId });

    if (!student) {
      return res.status(404).render('errorHandling/404', {
        title: '👨‍🎓 Student Not Found',
        message: 'Oops! The student you are looking for does not exist.'
      });
    }

    res.render('students/update-student', { student: student })
  } catch (error) {
    res.status(500).render('errorHandling/500', {
      title: 'Error code 500',
      message: error.message
    });
  }
}


export const updateStudent = async (req, res) => {

  const paramsID = mongoose.Types.ObjectId.isValid(req.params.id)

  if (!paramsID) {
    return res.status(404).render('errorHandling/404', {
      title: '📃 Page Not Found',
      message: 'Oops! The page you are looking for does not exist.'
    });
  }

  try {
    const { studentId, name, schClass, section, contact } = await req.body;

    const school = await School.findById(req.session.schoolId);
    const subjects = school.defaultSubjects

    const subjectsData = []
    subjects.forEach(sub => {
      const marks = Number(req.body[`marks${sub}`]) || 0;
      subjectsData.push({ subjectName: sub, marks, maxMarks: 100 });

    })


    const student = await Student.findByIdAndUpdate(req.params.id,
      {
        studentId,
        name,
        schClass,
        section,
        contact,
        subjects: subjectsData
      })

    if (!student) {
      return res.status(404).render('errorHandling/404', {
        title: '👨‍🎓 Student Not Found',
        message: 'Oops! The student you are looking for does not exist.'
      });
    }

    res.redirect('/view-students');
  } catch (error) {
    res.status(500).render('errorHandling/500', {
      title: 'Error code 500',
      message: error.message
    });
  }

}

// Delete Students
export const deleteStudent = async (req, res) => {
  const paramsID = mongoose.Types.ObjectId.isValid(req.params.id);

  if (!paramsID) {
    return res.status(404).render('errorHandling/404', {
      title: '📃 Page Not Found',
      message: 'Oops! The page you are looking for does not exist.'
    });
  }

  try {
    const student = await Student.findByIdAndDelete({ _id: req.params.id, schoolId: req.session.schoolId });

    if (!student) {
      return res.status(404).render('errorHandling/404', {
        title: '👨‍🎓 Student Not Found',
        message: 'Oops! The student you are looking for does not exist.'
      });
    }

    return res.redirect('/view-students'); // ✅ Add return here
  } catch (error) {
    return res.status(500).render('errorHandling/500', {
      title: 'Error code 500',
      message: error.message
    });
  }
};




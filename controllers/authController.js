import express from 'express'
import bcrypt from 'bcrypt'
import School from '../models/School.js'
import mongoose from 'mongoose'


export const signupPage = (req, res) => {
  res.render('signup', {
    error_msg: req.flash('error_msg'),
    success_msg: req.flash('success_msg')
  });
}

export const signupHandler = async (req, res) => {
  try {
    const { schoolName, email, password, schoolType } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const school = await School.findOne({ email });

    const latestSchId = await School.findOne({}).sort({ _id: -1 });
    let nextSchId = 1;
    if (latestSchId) {
      const lastSchId = latestSchId.schId;
      nextSchId = lastSchId + 1; // 8
    }
    const newSchId =  nextSchId

    if (school){
      req.flash('error_msg', 'User already exists')
      return res.redirect('/signup')
    }

    let subjects = [];
    if (schoolType === 'CBSE') {
      subjects = ['Math', 'English', 'Science', 'Social Studies'];
    } else {
      subjects = ['Marathi', 'Hindi', 'EVS', 'Math'];
    }

    const newSchool = new School({ 
      schoolName, 
      schId: newSchId,
      email, 
      password: hashedPassword, 
      schoolType,
      defaultSubjects: subjects
    });

    await newSchool.save();

    req.flash('success_msg', 'Your Registred')
    return res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving student record" });
  }
}



export const loginPage = (req, res) => {
  res.render('login', {
    error: null,
    error_msg: req.flash('error_msg'),
    success_msg: req.flash('success_msg')
  })
}

export const loginHandler = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    const school = await School.findOne({ email });


    if (!school){
      req.flash('error_msg', 'Invalid Email or Password')
      return res.redirect('/login')
    }
    
    // if (!school) return res.render('login', { error: "User not found" });
    
    const match = await bcrypt.compare(password, school.password);
    if (!match){
      req.flash('error_msg', 'Invalid Email or Password')
      return res.redirect('/login')
    }

    // if (!match) return res.render('login', { error: "Wrong Password" });

    req.session.schoolId = school._id;
    

     // Set longer session if "Remember Me" checked
  if (rememberMe) {
    req.session.cookie.maxAge = 86400000; // 1 days
  } else {
    req.session.cookie.expires = false; // session ends on browser close
  }


    res.redirect('/dashboard');
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).render('errorHandling/500', {
      title: 'Login Error',
      message: err.message
    });
  }
};

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
}


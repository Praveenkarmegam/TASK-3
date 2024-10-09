const express = require('express');
const Mentor = require('../models/Mentor');
const Student = require('../models/Student');

const router = express.Router();

// 1. API to create Mentor
router.post('/mentor', async (req, res) => {
  try {
    const mentor = new Mentor(req.body);
    await mentor.save();
    res.status(201).send(mentor);
  } catch (error) {
    res.status(400).send(error);
  }
});

// 2. API to create Student
router.post('/student', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).send(student);
  } catch (error) {
    res.status(400).send(error);
  }
});

// 3. API to Assign multiple Students to a Mentor
router.post('/mentor/:id/students', async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) {
      return res.status(404).send('Mentor not found');
    }

    const students = await Student.find({ _id: { $in: req.body.studentIds } });
    students.forEach(async (student) => {
      student.mentor = mentor._id;
      student.previousMentors.push(student.mentor);
      await student.save();
    });

    mentor.students.push(...req.body.studentIds);
    await mentor.save();

    res.status(200).send(mentor);
  } catch (error) {
    res.status(400).send(error);
  }
});

// 4. API to Assign or Change Mentor for a particular Student
router.put('/student/:id/mentor', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    const newMentor = await Mentor.findById(req.body.mentorId);

    if (!student || !newMentor) {
      return res.status(404).send('Student or Mentor not found');
    }

    student.previousMentors.push(student.mentor);
    student.mentor = newMentor._id;
    await student.save();

    newMentor.students.push(student._id);
    await newMentor.save();

    res.status(200).send(student);
  } catch (error) {
    res.status(400).send(error);
  }
});

// 5. API to show all students for a particular mentor
router.get('/mentor/:id/students', async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id).populate('students');
    if (!mentor) {
      return res.status(404).send('Mentor not found');
    }
    res.status(200).send(mentor.students);
  } catch (error) {
    res.status(400).send(error);
  }
});

// 6. API to show the previously assigned mentor for a particular student
router.get('/student/:id/mentor', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('mentor');
    if (!student) {
      return res.status(404).send('Student not found');
    }
    res.status(200).send(student.previousMentors);
  } catch (error) {
    res.status(400).send(error);
  }
});

// 7. API to list all Mentors
router.get('/mentor', async (req, res) => {
  try {
    const mentors = await Mentor.find();
    res.status(200).send(mentors);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 8. API to list all Students
router.get('/student', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).send(students);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;

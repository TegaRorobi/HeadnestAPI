const Therapist = require('../models/Therapist');
const Appointment = require('../models/Appointment');

// GET /therapists
const getAllTherapists = async (req, res) => {
  try {
    const therapists = await(Therapist.find({})).populate('user', 'avatar');

    res.status(200).json(therapists);

  } catch (err) {
    res.status(500).json(`Error: {$err.message}`)
  }
};

// GET /therapists/:id 
const getSingleTherapist = async (req, res) => {
  try {
    const { therapistID } = req.params; // From the URL parameter
    const therapist = await(Therapist.findOne({_id:therapistID})).populate('user', 'email, avatar');

    res.status(200).json(therapist);

  } catch (err) {
    res.status(500).json(`Error: {$err.message}`)
  }
};

// GET /appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await(Appointment.find({})).populate('user', 'avatar');

    res.status(200).json(appointments);

  } catch (err) {
    res.status(500).json(`Error: {$err.message}`)
  } 
};

// GET /appointments/:id 
const getSingleAppointment = async (req, res) => {
  try {
    const { appointmentID } = req.params; // From the URL parameter
    const appointment = await(appointment.findOne({_id:appointmentID})).populate('user', 'email, avatar');

    res.status(200).json(appointment);

  } catch (err) {
    res.status(500).json(`Error: {$err.message}`)
  }
};

// GET /appointments/user
const getUserAppointments = async (req, res) => {
  try {
    const userID = req.user.id;
    userAppointments = await(Appointment.find({user:userID})).populate('therapist', 'name specialization avatar');

    res.status(200).json(userAppointments);

  } catch (err) {
    res.status(500).json(`Error: {$err.message}`)
  }
}

module.exports = {
  getAllTherapists,
  getSingleTherapist,
  getAllAppointments,
  getSingleAppointment,
  getUserAppointments
}

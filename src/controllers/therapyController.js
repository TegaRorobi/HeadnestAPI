const Therapist = require('../models/Therapist');
const Appointment = require('../models/Appointment');
const mongoose = require('mongoose');


// GET /therapists
const getAllTherapists = async (req, res) => {
  try {
    const therapists = await Therapist.find({}).populate('user', 'email avatar');

    if (therapists.length > 0) {
      res.status(200).json(therapists);

    } else {
      res.status(404).json({message: 'No therapists found.' });
    }

  } catch (err) {
    res.status(500).json({error: err.message})
  }
};

// GET /therapists/:id 
const getSingleTherapist = async (req, res) => {
  try {
    const { therapistID } = req.params; // From the URL parameter

    if (!mongoose.isValidObjectId(therapistID)) {
      return res.status(400).json({message: "Invalid Therapist ID provided." });
    }

    const therapist = await Therapist.findById(therapistID).populate('user', 'email avatar');
    
    if (!therapist) {
      return res.status(404).json({message: `Therapist with id ${therapistID} not found.`});
    }

    res.status(200).json(therapist);

  } catch (err) {
    res.status(500).json({error: err.message})
  }
};

// GET /appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate('user', 'email avatar')
      .populate('therapist', 'name specialization avatar');

    if (appointments.length > 0) {
      res.status(200).json(appointments);

    } else {
      res.status(404).json({message: 'No appointments found.' });
    }

  } catch (err) {
    res.status(500).json({error: err.message})
  } 
};

// GET /appointments/:appointmentID 
const getSingleAppointment = async (req, res) => {
  try {
    const { appointmentID } = req.params; // From the URL parameter

    if (!mongoose.isValidObjectId(appointmentID)) {
      return res.status(400).json({message: "Invalid Appointment ID provided." });
    }

    const appointment = await Appointment.findById(appointmentID)
      .populate('user', 'email avatar')
      .populate('therapist', 'name specialization avatar');

    if (!appointment) {
      return res.status(404).json({message: `Appointment with id ${appointmentID} not found.`});
    }

    res.status(200).json(appointment);

  } catch (err) {
    console.log(err);
    res.status(500).json({error: err.message})
  }
};

// GET /appointments/user
const getUserAppointments = async (req, res) => {
  try {
    const userID = req.user.id;
    const userAppointments = await Appointment.find({user:userID})
      .populate('user', 'email avatar')
      .populate('therapist', 'name specialization avatar');

    if (userAppointments.length > 0) {
      res.status(200).json(userAppointments);

    } else {
      res.status(404).json({ message: 'No appointments found for this user.' });
    }

  } catch (err) {
    res.status(500).json({error: err.message})
  }
}

module.exports = {
  getAllTherapists,
  getSingleTherapist,
  getAllAppointments,
  getSingleAppointment,
  getUserAppointments
}

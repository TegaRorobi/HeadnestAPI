
const express = require('express');
const therapyController = require('../controllers/therapyController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
router.get('/therapists/:therapistID', therapyController.getSingleTherapist);
router.get('/therapists', therapyController.getAllTherapists);

router.get('/appointments/user', authMiddleware, therapyController.getUserAppointments);
router.get('/appointments/:appointmentID', therapyController.getSingleAppointment);
router.get('/appointments', therapyController.getAllAppointments);

module.exports = router

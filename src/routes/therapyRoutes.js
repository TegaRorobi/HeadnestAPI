
const express = require('express');
const therapyController = require('../controllers/therapyController');

const router = express.Router();
router.get('/therapists', therapyController.getAllTherapists);
router.get('/therapists/:id', therapyController.getSingleTherapist);
router.get('/appointments', therapyController.getAllAppointments);
router.get('/appointments/:id', therapyController.getSingleAppointment);
router.get('/appointments/user', therapyController.getUserAppointments);

module.exports = router

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getPaymentMethods, initiatePayment, verifyPayment, getPaymentTotal, handleWebhook, getPaymentStatus, chargeReturningCustomer } = require('../controllers/paymentController');

router.get('/payment/methods', authMiddleware, getPaymentMethods);

router.post('/payment/initiate', authMiddleware, initiatePayment);

router.post('/payment/verify', authMiddleware, verifyPayment);

router.get('/payment/total', authMiddleware, getPaymentTotal);

router.post('/payment/webhook', handleWebhook);

router.get('/payment/status/:reference', authMiddleware, getPaymentStatus);

router.post('/payment/charge-returning', authMiddleware, chargeReturningCustomer);

module.exports = router;
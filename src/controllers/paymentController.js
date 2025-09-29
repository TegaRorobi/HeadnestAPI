const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');
const PaystackService = require('../config/paystack');
const crypto = require('crypto');

// :::::::GET PAYMENT METHODS
// List all available payment options
const getPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = PaystackService.getPaymentMethods();

    const banksResult = await PaystackService.getBanks();
    
    let banks = [];
    if (banksResult.success) {
      banks = banksResult.data.filter(bank => bank.country === 'Nigeria').slice(0, 20);
    }

    res.status(200).json({
      success: true,
      message: 'Payment methods retrieved successfully',
      data: {
        paymentMethods,
        banks: banks.map(bank => ({
          id: bank.id,
          name: bank.name,
          code: bank.code,
          slug: bank.slug
        }))
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting payment methods',
      error: error.message
    });
  }
};


// :::::::INITIATE PAYMENT
// Begin payment transaction
const initiatePayment = async (req, res) => {
  try {
    const { appointmentId, paymentMethod } = req.body;
    const userId = req.user.id;
    const userEmail = req.user.email;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: 'Appointment ID is required'
      });
    }

    const appointment = await Appointment.findById(appointmentId).populate('therapist', 'name');
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only pay for your own appointments'
      });
    }

    const existingPayment = await Payment.findOne({ 
      appointmentId, 
      status: 'success' 
    });

    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: 'This appointment has already been paid for'
      });
    }

    const therapySessionPrice = 15000;
    const amount = PaystackService.nairaToKobo(therapySessionPrice);

    // Generate unique reference
    const reference = PaystackService.generateReference(userId);

    // Initialize payment with Paystack
    const paystackResponse = await PaystackService.initializePayment({
      email: userEmail,
      amount: amount,
      reference: reference,
      callback_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/payment/callback`,
      metadata: {
        appointmentId: appointmentId.toString(),
        userId: userId.toString(),
        therapistId: appointment.therapist._id.toString(),
        therapistName: appointment.therapist.name,
        appointmentDate: appointment.datetime,
        sessionType: 'therapy_session'
      }
    });

    if (!paystackResponse.success) {
      return res.status(400).json({
        success: false,
        message: 'Failed to initialize payment',
        error: paystackResponse.error
      });
    }

    // Create payment record in database
    const payment = new Payment({
      userId,
      appointmentId,
      paystackReference: reference,
      amount,
      currency: 'NGN',
      paymentMethod: paymentMethod || 'card',
      status: 'pending',
      paystackData: {
        authorization_url: paystackResponse.data.authorization_url,
        access_code: paystackResponse.data.access_code,
        reference: paystackResponse.data.reference
      },
      metadata: {
        session_type: 'therapy_session',
        therapist_id: appointment.therapist._id,
        appointment_date: appointment.datetime
      }
    });

    await payment.save();

    res.status(201).json({
      success: true,
      message: 'Payment initialized successfully',
      data: {
        paymentId: payment._id,
        reference: reference,
        amount: PaystackService.koboToNaira(amount),
        currency: 'NGN',
        authorization_url: paystackResponse.data.authorization_url,
        access_code: paystackResponse.data.access_code,
        appointment: {
          id: appointment._id,
          therapist: appointment.therapist.name,
          appointmentDate: appointment.datetime
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error initiating payment',
      error: error.message
    });
  }
};



// :::::::VERIFY IF THE PAYMENT IS SUCCESSFULL
const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.body;
    const userId = req.user.id;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: 'Payment reference is required'
      });
    }

    const payment = await Payment.findOne({ paystackReference: reference });
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    if (payment.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // If already verified, return existing data
    if (payment.status === 'success') {
      return res.status(200).json({
        success: true,
        message: 'Payment already verified',
        data: {
          paymentId: payment._id,
          reference: payment.paystackReference,
          amount: PaystackService.koboToNaira(payment.amount),
          status: payment.status,
          verifiedAt: payment.verifiedAt
        }
      });
    }

    // Verify with Paystack
    const verificationResult = await PaystackService.verifyPayment(reference);

    if (!verificationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
        error: verificationResult.error
      });
    }

    const paystackData = verificationResult.data;

    // Update payment status based on Paystack response
    const paymentStatus = paystackData.status === 'success' ? 'success' : 'failed';
    
    payment.status = paymentStatus;
    payment.verifiedAt = paymentStatus === 'success' ? new Date() : null;
    payment.paystackData = {
      ...payment.paystackData,
      transaction_id: paystackData.id,
      gateway_response: paystackData.gateway_response,
      paid_at: paystackData.paid_at,
      channel: paystackData.channel,
      fees: paystackData.fees,
      customer: paystackData.customer
    };

    await payment.save();

    // If payment successful, update appointment status
    if (paymentStatus === 'success') {
      await Appointment.findByIdAndUpdate(payment.appointmentId, { 
        status: 'confirmed',
        paidAt: new Date()
      });
    }

    res.status(200).json({
      success: true,
      message: `Payment ${paymentStatus === 'success' ? 'successful' : 'failed'}`,
      data: {
        paymentId: payment._id,
        reference: payment.paystackReference,
        amount: PaystackService.koboToNaira(payment.amount),
        status: payment.status,
        verifiedAt: payment.verifiedAt,
        channel: paystackData.channel,
        paidAt: paystackData.paid_at
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message
    });
  }
};

// :::::::GET THE TOTAL PAYMENT
const getPaymentTotal = async (req, res) => {
  try {
    const { appointmentId } = req.query;
    const userId = req.user.id;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: 'Appointment ID is required'
      });
    }

    // Find the appointment
    const appointment = await Appointment.findById(appointmentId)
      .populate('therapist', 'name specialization')
      .lean(); // lean() makes it a plain JS object

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if user owns this appointment
    if (appointment.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const basePrice = 15000;
    const platformFee = 500;
    const totalAmount = basePrice + platformFee;

    res.status(200).json({
      success: true,
      message: 'Payment total calculated successfully',
      data: {
        appointmentId: appointment._id,
        pricing: {
          basePrice,
          platformFee,
          totalAmount,
          currency: 'NGN'
        },
        appointment: {
          therapist: appointment.therapist.name,
          specialization: appointment.therapist.specialization,
          datetime: appointment.datetime,
          duration: appointment.duration || '60 minutes',
          status: appointment.status || 'pending',g
          paidAt: appointment.paidAt || null    
        },
        breakdown: [
          { item: 'Therapy Session', amount: basePrice },
          { item: 'Platform Fee', amount: platformFee }
        ]
      }
    });

  } catch (error) {
    // Detect if timeout / connection issue
    const isTimeout = error.message.includes('buffering timed out');
    res.status(500).json({
      success: false,
      message: isTimeout
        ? 'Database connection timed out. Check MongoDB connection.'
        : 'Error calculating payment total',
      error: error.message
    });
  }
};

// const getPaymentTotal = async (req, res) => {
//   try {
//     const { appointmentId } = req.query;
//     const userId = req.user.id;

//     if (!appointmentId) {
//       return res.status(400).json({
//         success: false,
//         message: 'Appointment ID is required'
//       });
//     }

//     // Find the appointment
//     const appointment = await Appointment.findById(appointmentId).populate('therapist', 'name specialization');
    
//     if (!appointment) {
//       return res.status(404).json({
//         success: false,
//         message: 'Appointment not found'
//       });
//     }

//     // Check if user owns this appointment
//     if (appointment.user.toString() !== userId.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: 'Access denied'
//       });
//     }

//     const basePrice = 15000;
//     let finalPrice = basePrice;
    
//     // dynamic pricing (optional)
//     // if (appointment.therapist.specialization === 'Senior Therapist') {
//     //   finalPrice = 20000;
//     // }
    
//     // Calculate any discounts or additional fees
//     const platformFee = 500;
//     const totalAmount = finalPrice + platformFee;

//     res.status(200).json({
//       success: true,
//       message: 'Payment total calculated successfully',
//       data: {
//         appointmentId: appointment._id,
//         pricing: {
//           basePrice: basePrice,
//           platformFee: platformFee,
//           totalAmount: totalAmount,
//           currency: 'NGN'
//         },
//         appointment: {
//           therapist: appointment.therapist.name,
//           specialization: appointment.therapist.specialization,
//           appointmentDate: appointment.datetime,
//           duration: appointment.duration || '60 minutes'
//         },
//         breakdown: [
//           {
//             item: 'Therapy Session',
//             amount: basePrice
//           },
//           {
//             item: 'Platform Fee', 
//             amount: platformFee
//           }
//         ]
//       }
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error calculating payment total',
//       error: error.message
//     });
//   }
// };

// ::::::: Paystack webhook for automatic payment verification
const handleWebhook = async (req, res) => {
  try {
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature'
      });
    }

    const event = req.body;

    // Handle successful payment
    if (event.event === 'charge.success') {
      const { reference } = event.data;

      // Find payment record
      const payment = await Payment.findOne({ paystackReference: reference });
      
      if (payment && payment.status === 'pending') {
        payment.status = 'success';
        payment.verifiedAt = new Date();
        payment.paystackData = {
          ...payment.paystackData,
          transaction_id: event.data.id,
          gateway_response: event.data.gateway_response,
          paid_at: event.data.paid_at,
          channel: event.data.channel,
          fees: event.data.fees,
          customer: event.data.customer
        };

        await payment.save();

        // Update appointment status to confirmed
        await Appointment.findByIdAndUpdate(payment.appointmentId, { 
          status: 'confirmed',
          paidAt: new Date()
        });

        console.log(`Payment webhook processed: ${reference} - SUCCESS`);
      }
    }

    // Handle failed payment
    if (event.event === 'charge.failed') {
      const { reference } = event.data;

      const payment = await Payment.findOne({ paystackReference: reference });
      
      if (payment && payment.status === 'pending') {
        payment.status = 'failed';
        payment.paystackData = {
          ...payment.paystackData,
          gateway_response: event.data.gateway_response
        };
        
        await payment.save();
        console.log(`Payment webhook processed: ${reference} - FAILED`);
      }
    }

    res.status(200).json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing error',
      error: error.message
    });
  }
};

// :::::::CHECK PAYMENT STATUS MANUALLY
const getPaymentStatus = async (req, res) => {
  try {
    const { reference } = req.params;
    const userId = req.user.id;

    // Find payment record
    const payment = await Payment.findOne({ paystackReference: reference })
      .populate('appointmentId', 'datetime therapist');
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check if user owns this payment
    if (payment.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment status retrieved',
      data: {
        reference: payment.paystackReference,
        status: payment.status,
        amount: PaystackService.koboToNaira(payment.amount),
        currency: payment.currency,
        paymentMethod: payment.paymentMethod,
        verifiedAt: payment.verifiedAt,
        createdAt: payment.createdAt,
        appointment: payment.appointmentId
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting payment status',
      error: error.message
    });
  }
};

// :::::::CHARGE RETURNING CUSTOMERS FOR FUTURE PAYMENT
const chargeReturningCustomer = async (req, res) => {
  try {
    const { appointmentId, authorizationCode } = req.body;
    const userId = req.user.id;
    const userEmail = req.user.email;

    if (!appointmentId || !authorizationCode) {
      return res.status(400).json({
        success: false,
        message: 'Appointment ID and authorization code are required'
      });
    }

    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check ownership
    if (appointment.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Calculate amount
    const therapySessionPrice = 15000;
    const amount = PaystackService.nairaToKobo(therapySessionPrice + 500);

    const reference = PaystackService.generateReference(userId);

    // Charge authorization using Paystack
    const chargeData = {
      email: userEmail,
      amount: amount,
      authorization_code: authorizationCode,
      reference: reference
    };

    // Make API call to Paystack charge endpoint
    const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);
    const response = await paystack.transaction.charge_authorization(chargeData);

    if (response.data.status !== 'success') {
      return res.status(400).json({
        success: false,
        message: 'Payment failed',
        error: response.data.gateway_response
      });
    }

    // Create payment record
    const payment = new Payment({
      userId,
      appointmentId,
      paystackReference: reference,
      amount,
      currency: 'NGN',
      paymentMethod: 'card',
      status: 'success',
      verifiedAt: new Date(),
      paystackData: {
        transaction_id: response.data.id,
        gateway_response: response.data.gateway_response,
        paid_at: response.data.paid_at,
        channel: response.data.channel,
        fees: response.data.fees,
        customer: response.data.customer
      },
      metadata: {
        session_type: 'therapy_session',
        therapist_id: appointment.therapist,
        appointment_date: appointment.datetime
      }
    });

    await payment.save();

    // Update appointment status
    await Appointment.findByIdAndUpdate(appointmentId, { 
      status: 'confirmed',
      paidAt: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Payment successful',
      data: {
        paymentId: payment._id,
        reference: payment.paystackReference,
        amount: PaystackService.koboToNaira(payment.amount),
        status: payment.status,
        paidAt: payment.verifiedAt
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing payment',
      error: error.message
    });
  }
};

module.exports = {
  getPaymentMethods,
  initiatePayment,
  verifyPayment,
  getPaymentTotal,
  handleWebhook,
  getPaymentStatus,
  chargeReturningCustomer
};
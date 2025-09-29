
const Appointment = require('../models/Appointment');

const sessionAuthMiddleware = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let sessionId;

    // Get sessionId from different sources
    if (req.params.id) {
      sessionId = req.params.id;
    } else if (req.body.sessionId) {
      sessionId = req.body.sessionId;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }


    // Find the booking/session
    const booking = await Appointment.findById(sessionId);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Check if user has access to this session
    const hasAccess = booking.user.toString() === userId.toString() || 
                     booking.therapist.toString() === userId.toString();

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this chat session'
      });
    }

    // Determine user type and attach to request
    const userType = booking.therapist.toString() === userId.toString() ? 'therapist' : 'user';
    
   
    req.session = {
      booking,
      sessionId,
      userType,
      hasAccess: true
    };

    next();

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error validating session access',
      error: error.message
    });
  }
};

module.exports = sessionAuthMiddleware;
const TherapyChat = require('../models/TherapyChat');

const accessChatroom = async (req, res) => {
  try {
    const { sessionId, booking } = req.session;

    // Get chat messages for this session
    const messages = await TherapyChat.find({ 
      sessionId,
      isDeleted: false 
    })
    .populate('senderId', 'name email')
    .sort({ createdAt: 1 })
    .limit(100); 

    res.status(200).json({
      success: true,
      message: 'Chat session accessed successfully',
      data: {
        sessionId,
        sessionInfo: {
          bookingId: booking._id,
          userId: booking.userId,
          therapistId: booking.therapistId,
          sessionDate: booking.appointmentDate
        },
        messages: messages,
        messageCount: messages.length
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error accessing chat session',
      error: error.message
    });
  }
};


const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { sessionId, userType } = req.session;
    const userId = req.user.id;

    // Validate message content
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    // Create new message
    const newMessage = new TherapyChat({
      sessionId,
      senderId: userId,
      senderType: userType,
      message: message.trim(),
      messageType: 'text'
    });

    await newMessage.save();

    await newMessage.populate('senderId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
};

const exitChatroom = async (req, res) => {
  try {
    const { sessionId, userType } = req.session;
    const userId = req.user.id;

    const userName = req.user.name || (userType === 'therapist' ? 'Therapist' : 'User');

    
    const exitMessage = new TherapyChat({
      sessionId,
      senderId: userId,
      senderType: userType,
      message: `${userName} has left the chat session`,
      messageType: 'notification'
    });

    await exitMessage.save();

    res.status(200).json({
      success: true,
      message: 'Successfully exited chatroom',
      data: {
        sessionId,
        exitedBy: userType,
        exitTime: exitMessage.createdAt
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error exiting chatroom',
      error: error.message
    });
  }
};

const clearExpiredMessages = async (req, res) => {
  try {
  
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const result = await TherapyChat.deleteMany({
      createdAt: { $lt: sevenDaysAgo }
    });

    res.status(200).json({
      success: true,
      message: 'Expired messages cleared successfully',
      data: {
        deletedCount: result.deletedCount,
        cleanupDate: new Date()
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing expired messages',
      error: error.message
    });
  }
};

// /notify when someone Join/leave the chat
const sendNotification = async (req, res) => {
  try {
    const { action } = req.body; 
    const { sessionId, userType } = req.session;
    const userId = req.user.id;

    if (!action) {
      return res.status(400).json({
        success: false,
        message: 'Action is required (joined/left)'
      });
    }

    // Get user name and Create notification message
    const userName = req.user.name || (userType === 'therapist' ? 'Therapist' : 'User');

    const notificationMessage = `${userName} has ${action} the chat session`;

    const notification = new TherapyChat({
      sessionId,
      senderId: userId,
      senderType: userType,
      message: notificationMessage,
      messageType: 'notification'
    });

    await notification.save();

    res.status(201).json({
      success: true,
      message: 'Notification sent successfully',
      data: notification
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending notification',
      error: error.message
    });
  }
};

module.exports = {
  accessChatroom,
  sendMessage,
  exitChatroom,
  clearExpiredMessages,
  sendNotification
};

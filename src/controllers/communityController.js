const Community = require('../models/Community');

// GET List of all available communities
const getCommunities = async (req, res) => {
  try {
    // Get the list of all active communities
    const communities = await Community.find({ isActive: true })
      .select('name description category iconColor memberCount')
      .sort({ category: 1 });

    res.status(200).json({
      success: true,
      message: 'Communities retrieved successfully',
      data: communities
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting communities',
      error: error.message
    });
  }
};

// Join a specific community
const joinCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the community
    const community = await Community.findById(id);
    
    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    // Check if user already joined
    const alreadyJoined = community.members.some(
      member => member.userId.toString() === userId.toString()
    );

    if (alreadyJoined) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this community'
      });
    }

    // Check member limit
    if (community.memberCount >= 5000) {
      return res.status(400).json({
        success: false,
        message: 'Community has reached maximum capacity'
      });
    }

    // Add user to community
    community.members.push({
      userId: userId,
      joinedAt: new Date()
    });


    community.memberCount = community.members.length;
    await community.save();

    res.status(200).json({
      success: true,
      message: 'Successfully joined community',
      data: {
        communityId: community._id,
        communityName: community.name,
        memberCount: community.memberCount
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error joining community',
      error: error.message
    });
  }
};

// Leave a specific community
const leaveCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the community
    const community = await Community.findById(id);
    
    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    // Check if user is a member
    const memberIndex = community.members.findIndex(
      member => member.userId.toString() === userId.toString()
    );

    if (memberIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'You are not a member of this community'
      });
    }

    // Remove user from community
    community.members.splice(memberIndex, 1);

    community.memberCount = community.members.length;
    await community.save();

    res.status(200).json({
      success: true,
      message: 'Successfully left community',
      data: {
        communityId: community._id,
        communityName: community.name,
        memberCount: community.memberCount
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error leaving community',
      error: error.message
    });
  }
};

module.exports = {
  getCommunities,
  joinCommunity,
  leaveCommunity
};
const logger = require ('../../logger')
const MoodCheckin = require ('../models/MoodCheckin');


const submitMoodCheckin = async (req , res) => {
    
    try {
        
        const {mood, notes} = req.body;
        const userId = req.user.id;

        const moodCheckin = new MoodCheckin({
            userId,
            mood,
            notes : notes || ''
        });

        await moodCheckin.save();
        logger.info('mood created');
        res.status(201).json({
            success : true,
            message : 'Mood check-in submitted successfully',
            data : moodCheckin
        })
    } catch (error) {
        logger.error(error)
        res.status(500).json({
        success: false,
        message: 'Error submitting mood check-in',
        error: error.message
        });
    }
}


const getMoodProgress = async (req , res) => {
    
    try {
        const userId = req.user.id;

        // Get start and end of current week
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDate()));
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        // Count check-ins this week
        const weeklyCheckins = await MoodCheckin.countDocuments({
            userId,
            createdAt : {
                $gte : startOfWeek,
                $gte : endOfWeek
            }
        });

        // Get recent moods (last 7 days)
        const recentMoods = await MoodCheckin.find({
            userId,
            createdAt : { $gte : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}
        })
        .select('mood createdAt')
        .sort({createdAt : -1});

        res.status(200).json({
        success: true,
        data: {
            weeklyStreak: weeklyCheckins,
            totalThisWeek: weeklyCheckins,
            recentMoods
        }
    });
    } catch (error) {
        res.status(500).json({
        success: false,
        message: 'Error getting mood progress',
        error: error.message
    });
    }
}

module.exports = {
    submitMoodCheckin,
    getMoodProgress
}
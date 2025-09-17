const mongoose = require('mongoose');
const Community = require('../models/Community');
require('dotenv').config();


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Communities to create
const communities = [
  {
    name: "Depression Support Circle",
    description: "A safe space to talk to others who understand depression. Share experiences and find comfort in knowing you're not alone.",
    category: "Depression Support",
    iconColor: "#2563eb"
  },
  {
    name: "Anxiety Help Community", 
    description: "Connect with others managing anxiety. Share coping strategies and support each other through difficult moments.",
    category: "Anxiety Help",
    iconColor: "#7c3aed"
  },
  {
    name: "Stress Relief Zone",
    description: "Learn and share stress management techniques. Talk about work, life, and finding balance in a supportive environment.",
    category: "Stress Management", 
    iconColor: "#059669"
  },
  {
    name: "General Wellness Hub",
    description: "Focus on overall mental health and wellness. Share positive experiences, self-care tips, and encouragement.",
    category: "General Wellness",
    iconColor: "#ea580c"
  },
  {
    name: "Grief & Loss Support",
    description: "A compassionate space for those dealing with loss. Share memories, feelings, and find comfort during difficult times.",
    category: "Grief Support",
    iconColor: "#dc2626"
  },
  {
    name: "Recovery Warriors",
    description: "Support for addiction recovery journey. Share milestones, challenges, and celebrate progress together.",
    category: "Addiction Recovery",
    iconColor: "#0891b2"
  },
  {
    name: "Teen Mental Health Corner",
    description: "A space for teenagers to discuss mental health challenges. School stress, relationships, and growing up in a safe environment.",
    category: "Teen Mental Health", 
    iconColor: "#4338ca"
  },
  {
    name: "Workplace Wellness Circle",
    description: "Discuss work-related stress, burnout, and finding balance. Share professional mental health strategies.",
    category: "Workplace Stress",
    iconColor: "#be185d"
  }
];

// Seed function
const seedCommunities = async () => {
  try {
  
    const existingCommunities = await Community.countDocuments();
    
    if (existingCommunities > 0) {
      console.log(`${existingCommunities} communities already exist. Skipping seed.`);
      return;
    }

    // Create communities
    const createdCommunities = await Community.insertMany(communities);
    console.log(`Created ${createdCommunities.length} communities successfully!`);
    
    // Display created communities
    createdCommunities.forEach(community => {
      console.log(`- ${community.name} (${community.category})`);
    });

  } catch (error) {
    console.error('Error seeding communities:', error);
  }
};

// Run the seed
const runSeed = async () => {
  await connectDB();
  await seedCommunities();
  await mongoose.connection.close();
  console.log('Seed completed. Database connection closed.');
};

// Run if called directly
if (require.main === module) {
  runSeed();
}

module.exports = { seedCommunities };
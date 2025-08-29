const { Worker } = require("bullmq");
const IORedis = require("ioredis");
require('dotenv').config();
const sendWelcomeEmail = require("./emailService")
const logger = require ('./logger')


const connection = {
  host: "redis-18414.c14.us-east-1-3.ec2.redns.redis-cloud.com",
  port: 18414, 
  username: "default",
  password: process.env.REDIS_PASSWORD,
};


const worker = new Worker ( "email-queue" ,  async (job) => {
    console.log(`Processing job ${job.id} for ${job.data.email}`);
    console.log('Job data:', job.data);
    await sendWelcomeEmail(job.data.email);
},

{connection}

);

worker.on("completed" , (job) => {
    console.log(`job ${job.id} completed for ${job.data.email}`);
});

worker.on("failed" , (job, err) => {
    logger.error(err)
    console.error(`job ${job.id} failed :  ${err.message}`);
});
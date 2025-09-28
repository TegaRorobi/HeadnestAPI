const { Queue } = require("bullmq");
const IORedis = require("ioredis");
require('dotenv').config()


const connection = {
  host: "redis-18414.c14.us-east-1-3.ec2.redns.redis-cloud.com",
  port: 18414, 
  username: "default",
  password: process.env.REDIS_PASSWORD,
};

const emailQueue = new Queue("email-queue", { connection });

module.exports = emailQueue;
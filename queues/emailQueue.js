const { Queue } = require('bullmq');
const IORedis= require('ioredis');

const hostRedis='localhost';
const portRedis= 6379;

const connection= new IORedis({
    host: hostRedis ,
    port: portRedis,
});

const emailQueue= new Queue('emailQueue',{connection});

emailQueue.on('completed',(job)=>{
    console.log(`Job completed with result: ${job.returnvalue}`);
});

module.exports= emailQueue;

const { Worker } = require('bullmq');
const { emailQueue } = require('../config/queue');

const worker = new Worker(emailQueue.name, async job => {
  console.log('Processing job', job.id, job.data);
  // TODO: send email
});

module.exports = worker;

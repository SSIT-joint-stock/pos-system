// Test script for EmailQueueService
const dotenv = require('dotenv');
dotenv.config({ path: '../../../.env.development' });

const { EmailQueueService } = require('@repo/email');

async function testEmailQueue() {
  // Initialize the queue service with config from environment variables
  const queueService = new EmailQueueService({
    service: process.env.EMAIL_SERVICE || 'gmail',
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    notificationEmail: process.env.EMAIL_NOTI,
    defaultFrom: process.env.EMAIL_DEFAULT_FROM,
    templatePath: process.env.EMAIL_TEMPLATE_PATH,
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD || undefined,
    },
    logLevel: 'debug',
    // Optional: queue overrides
    // queue: {
    //   name: process.env.EMAIL_QUEUE_NAME,
    //   prefix: process.env.EMAIL_QUEUE_PREFIX,
    //   attempts: parseInt(process.env.EMAIL_QUEUE_ATTEMPTS || '3', 10),
    //   backoffDelay: parseInt(process.env.EMAIL_QUEUE_BACKOFF || '10000', 10),
    //   removeOnComplete: parseInt(process.env.EMAIL_QUEUE_REMOVE_ON_COMPLETE || '200', 10),
    //   removeOnFail: parseInt(process.env.EMAIL_QUEUE_REMOVE_ON_FAIL || '2000', 10),
    // },
  });

  // Enqueue a test email
  const htmlBody = '<h1>Test Email</h1><p>This is a test email from test_email_queue.js</p>';
  const textBody = 'Test Email - This is a test email from test_email_queue.js';
  const start = performance.now();
  const enqueueResult = await queueService.sendEmail(
    htmlBody,
    {
      to: process.env.EMAIL_TEST_RECIPIENT,
      subject: 'Test Email from Queue',
      cc: [],
      bcc: [],
      priority: 'high',
      category: 'TEST',
    },
    textBody
  ).then((result) => {
    const end = performance.now();
    console.log('Time taken:', end - start, 'ms');
    return result;
  });

  console.log('Enqueue Result:', enqueueResult);

  if (enqueueResult.success && enqueueResult.jobId) {
    console.log('Waiting 5 seconds before checking status...');
    setTimeout(async () => {
      const status = await queueService.getEmailStatus(enqueueResult.jobId);
      console.log('Email Status:', status);
      await queueService.close();
      process.exit(0);
    }, 5000);
  } else {
    console.error('Failed to enqueue email.');
    await queueService.close();
    process.exit(1);
  }
}

testEmailQueue().catch(err => {
  console.error('Error in testEmailQueue:', err);
  process.exit(1);
});

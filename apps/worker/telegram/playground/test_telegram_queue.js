// Test script for TelegramQueueService
const dotenv = require('dotenv');
dotenv.config({ path: '../../.env' });

const { TelegramQueueService } = require('@repo/telegram');

async function testTelegramQueue() {
  // Initialize the queue service with config from environment variables
  const queueService = new TelegramQueueService({
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    recipientId: process.env.TELEGRAM_RECIPIENT_ID,
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD || undefined
    }
    // queue options can be added here if needed
  });

  // Enqueue a test message
  const enqueueResult = await queueService.sendMessage(
    '🧪 This is a test message from test_telegram_queue.js!',
    {
      priority: 'high',
      category: 'TEST',
      disableNotification: false
    }
  );

  console.log('Enqueue Result:', enqueueResult);

  if (enqueueResult.success && enqueueResult.jobId) {
    // Wait a bit for the worker to process the job
    console.log('Waiting 5 seconds before checking status...');
    setTimeout(async () => {
      const status = await queueService.getMessageStatus(enqueueResult.jobId);
      console.log('Message Status:', status);
      // Close the queue connection
      await queueService.close();
      process.exit(0);
    }, 5000);
  } else {
    console.error('Failed to enqueue message.');
    await queueService.close();
    process.exit(1);
  }
}

// Run the test
testTelegramQueue().catch(err => {
  console.error('Error in testTelegramQueue:', err);
  process.exit(1);
});

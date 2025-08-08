import { createLogger } from '@repo/logger';
import { defaultConfig } from './config';
import { Telegraf } from 'telegraf';
import { TelegramService } from '@repo/telegram';
const logger = createLogger({ serviceName: 'MainTelegramBot' });
let mainTelegramService: TelegramService;

async function startMainBot() {
    const botToken = defaultConfig.botToken;
    if (!botToken) {
        logger.error('Main Bot: TELEGRAM_BOT_TOKEN is not set!');
        process.exit(1);
    }

    mainTelegramService = new TelegramService({ botToken });
    await mainTelegramService.getBot().telegram.deleteWebhook({ drop_pending_updates: true });
    // Thiết lập các handler cho lệnh, tin nhắn ở đây
    mainTelegramService.getBot().start((ctx) => {
        logger.info(`Received /start command from chat ID: ${ctx.chat.id}, user: ${ctx.from.username || ctx.from.id}`);
        ctx.reply(`Welcome! Your Chat ID is ${ctx.chat.id}. Please provide this ID to the application if needed.`);
    });
    mainTelegramService.getBot().help((ctx) => {
        ctx.reply('This bot is used for system notifications. There are no commands available.');
    });

    try {
        // Chỉ launch ở đây!
        await mainTelegramService.launch(); // dropPendingUpdates để bỏ qua các update cũ
        logger.info('Main Telegram Bot is up and running (polling).');
    } catch (error) {
        logger.error('Main Bot: Failed to launch', { error });
        process.exit(1);
    }
}

startMainBot();

process.on('SIGINT', () => {
    logger.info('Received SIGINT signal');
    mainTelegramService.stop();
    process.exit(0);
});
process.on('SIGTERM', () => {
    logger.info('Received SIGTERM signal');
    mainTelegramService.stop();
    process.exit(0);
});
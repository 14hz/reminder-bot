const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const prefix = '!';

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'reminder') {
    const timeUnit = args[0];
    const reminderTime = parseInt(args[1]);

    if (!timeUnit || isNaN(reminderTime)) {
      return message.reply('Invalid time or time unit.');
    }

    let timeInMilliseconds = 0;
    switch (timeUnit) {
      case 'seconds':
        timeInMilliseconds = reminderTime * 1000;
        break;
      case 'minutes':
        timeInMilliseconds = reminderTime * 60 * 1000;
        break;
      case 'hours':
        timeInMilliseconds = reminderTime * 60 * 60 * 1000;
        break;
      case 'days':
        timeInMilliseconds = reminderTime * 24 * 60 * 60 * 1000;
        break;
      default:
        return;
    }

    setTimeout(async () => {
      try {
        const user = await client.users.fetch(message.author.id);
        user.send(`⏰ Reminder: ${reminderTime} ${timeUnit}`);
        message.reply(`⏰ Reminder set for ${reminderTime} ${timeUnit}.`);
      } catch (error) {
        console.error(`Error sending reminder: ${error}`);
      }
    }, timeInMilliseconds);
  }
});

client.login('YOUR_BOT_TOKEN');

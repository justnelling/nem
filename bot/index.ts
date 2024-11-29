import { Telegraf, Context } from "telegraf";
import { BOT_TOKEN, WEBAPP_URL } from "./config";

if (!BOT_TOKEN) {
  throw new Error("TELEGRAM BOT_TOKEN must be provided");
}

const bot = new Telegraf(BOT_TOKEN);

// start command
bot.command("start", async (ctx) => {
  const username = ctx.message.from.first_name;
  await ctx.reply(
    `Welcome to NEM 👋, ${username}!\n\n` +
      `I can help you store, retrieve and map your notes. Think of me like your second brain!\n` +
      `Here's how to get started:\n` +
      `• Use /webapp to open the note-taking interface\n` +
      `• Use /help to see all available commands\n` +
      `• Use /stats to view your note statistics\n\n` +
      `Your notes are securely stored and accessible anytime!`
  );
});

// help command
bot.command("help", async (ctx) => {
  await ctx.reply(
    `Available commands:\n\n` +
      `Available commands:\n\n` +
      `/start - Get started with NEM\n` +
      `/help - Show all available commands\n` +
      `/webapp - Open the note-taking interface\n` +
      `/stats - View your note-taking stats\n` +
      `/latest - Show recent notes\n\n` +
      `Need help? Contact @jnelling`
  );
});

// webapp command
bot.command("webapp", async (ctx) => {
  const chatId = ctx.chat.id;
  const userId = ctx.from.id;

  // encode both chatId an userId for the webapp
  const encodedData = Buffer.from(JSON.stringify({ chatId, userId })).toString(
    "base64"
  );

  await ctx.reply("Access your notes here:", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: " Open Note Manager",
            url: `${WEBAPP_URL}?startapp=${encodedData}`,
          },
        ],
      ],
    },
  });
});

// stats command
bot.command("stats", async (ctx) => {
  const userId = ctx.from.id;

  // TODO: integrate with Supabase to get actual stats
  await ctx.reply(
    `Your Note Statistics:\n\n` +
      `• Total notes: Coming soon\n` +
      `• Notes this week: Coming soon\n` +
      `• Most recent note: Coming soon\n\n` +
      `Use /webapp to manage your notes!`
  );
});

// latest notes command
bot.command("latest", async (ctx) => {
  const userId = ctx.from.id;

  // TODO: integrate with supabase to get latest notes
  await ctx.reply(
    `Your Recent Notes:\n\n` +
      `Coming soon...\n\n` +
      `Open /webapp to view all your notes!`
  );
});

// handle other messages
bot.on("message", async (ctx) => {
  await ctx.reply(
    "I can only respond to specific commands. Use /help to see what I can do"
  );
});

// launch botbot
bot.launch().then(() => {
  console.log("NEM the Bot is running...");
});

// enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

import { Telegraf } from "telegraf";
import { noteOperations } from "@/app/lib/notes";
import { BOT_TOKEN, WEBAPP_URL } from "./config";
import { UserSession } from "./types";

if (!BOT_TOKEN) {
  throw new Error("TELEGRAM BOT_TOKEN must be provided");
}

const bot = new Telegraf(BOT_TOKEN);
const userSessions = new Map<number, UserSession>();
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;

// start command
bot.command("start", async (ctx) => {
  const username = ctx.message.from.first_name;
  await ctx.reply(
    `Welcome to NEM ⚛️, ${username}!\n\n` +
      `I can help you store, retrieve and map your notes. Think of me like your second brain!\n\n` +
      `Here's how to get started:\n` +
      `• Use /webapp to open the full note-taking interface\n` +
      `• Use /help to see all available commands\n` +
      `• Use /stats to view your note statistics\n` +
      `• Use /latest to view your latest notes\n\n` +
      `Your notes are securely stored and accessible anytime!`
  );
});

// help command
bot.command("help", async (ctx) => {
  await ctx.reply(
    `Available commands:\n\n` +
      `/start - Get started\n` +
      `/help - Show commands\n` +
      `/webapp - Open interface\n` +
      `/record - Start saving chat\n` +
      `/stop - Stop recording\n` +
      `/stats - View stats\n` +
      `/latest - Recent notes`
  );
});

// record as notes (24 hr)
bot.command("record", async (ctx) => {
  const userId = ctx.from.id;
  userSessions.set(userId, {
    isRecordingNotes: true,
    sessionStartTime: Date.now(),
    lastInteraction: Date.now(),
  });

  await ctx.reply(
    "🎯 Recording started! Messages will be saved as notes for the next 24 hours.\nUse /stop if you want to end notes capture early."
  );
});

// stop record
bot.command("stop", async (ctx) => {
  const userId = ctx.from.id;
  userSessions.delete(userId);
  await ctx.reply("✅ Stopped recording notes.");
});

// on text (other messages)
bot.on("message", async (ctx) => {
  // type guard to ensure we have a text message
  if (!("text" in ctx.message)) return;
  if (ctx.message.text.startsWith("/")) return;

  const userId = ctx.from.id;
  const session = userSessions.get(userId);

  if (!session?.isRecordingNotes) {
    await ctx.reply("Save this as a note?", {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Save", callback_data: `save_${ctx.message.message_id}` },
            { text: "Start Recording", callback_data: "start_recording" },
          ],
        ],
      },
    });
    return;
  }

  if (Date.now() - session.sessionStartTime > SESSION_TIMEOUT) {
    userSessions.delete(userId);
    await ctx.reply("Recording session expired. Use /record to start new one.");
    return;
  }

  try {
    await noteOperations.createNote({
      userId: userId.toString(),
      title: ctx.message.text.split("\n")[0].slice(0, 50),
      content: ctx.message.text,
      metadata: { source: "telegram" },
      source_chat_id: ctx.chat.id.toString(),
      source_message_id: ctx.message.message_id,
    });
    await ctx.reply("✅ Saved as note!");
  } catch (error) {
    console.error("Error saving note: ", error);
    await ctx.reply("Sorry, I couldn't save your note. Please try again.");
  }
});

// the callbacks that we pass into on(message), when they select the inline keyboard actions
bot.action(/save_(\d+)/, async (ctx) => {
  if (!ctx.callbackQuery) return;
  const text = ctx.text as unknown as string; // Force type assertion
  if (!text) return;

  const messageId = parseInt(ctx.match[1]);
  const userId = ctx.callbackQuery.from.id;
  const chatId = ctx.callbackQuery.message?.chat.id;

  try {
    await noteOperations.createNote({
      userId: userId.toString(),
      title: text.split("\n")[0].slice(0, 50),
      content: text,
      metadata: { source: "telegram" },
      source_chat_id: chatId?.toString(),
      source_message_id: messageId,
    });
    await ctx.editMessageText("✅ Saved as note!");
  } catch (error) {
    console.error("Error saving note:", error);
    await ctx.editMessageText(
      "Sorry, I couldn't save your note. Please try again."
    );
  }
});

bot.action("start_recording", async (ctx) => {
  const userId = ctx.callbackQuery?.from.id;
  if (!userId) return;
  const text = ctx.text as unknown as string; // Force type assertion
  if (!text) return;

  userSessions.set(userId, {
    isRecordingNotes: true,
    sessionStartTime: Date.now(),
    lastInteraction: Date.now(),
  });

  try {
    await noteOperations.createNote({
      userId: userId.toString(),
      title: text.split("\n")[0].slice(0, 50),
      content: text,
      metadata: { source: "telegram" },
      source_chat_id: ctx.callbackQuery?.message?.chat.id.toString(),
      source_message_id: ctx.callbackQuery?.message?.message_id,
    });

    await ctx.editMessageText(
      "🎯 Recording started! Messages will be saved as notes.\n" +
        "Previous message has been saved.\n" +
        "Use /stop when done."
    );
  } catch (error) {
    console.error("Error starting recording:", error);
    await ctx.editMessageText("Failed to start recording. Please try again.");
  }
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

// launch botbot
bot.launch().then(() => {
  console.log("NEM the Bot is running...");
});

// enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

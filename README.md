# NOTETAKER

## web app + telegram mini app

### Phase 1: Telegram Mini App

recreate using: https://medium.com/@tanguyvans/building-a-telegram-mini-app-a-step-by-step-guide-d921d2e23442 / https://github.com/Tanguyvans/task-board-telegram/blob/main/app/page.tsx

https://claude.ai/chat/11c5c4d9-a43e-4d8e-96b6-2c0523ebe60e

1. can send notes to telegram bot in any chat
2. can enter 1-on-1 chat with notes bot
3. can open web app and get richer features there

### Conventions

TBC -- code comments for changes to come back to. CTRL-F !

#### Progress logs

**1/12/24**

Features:

1.  can now chat with note bot, will store messages as notes
2.  can forward messages from other chats to note bot, will also store those as notes
3.  can build thread / parent + child relationship for notes. but need to research supabase ltree more, and understand how it works.

        - need to work on displaying the thread hierarchy nicer later

    STRETCH

    1. add functionality where they can select messages in chat, either with telegram bot or in other chats, and add it to notes capture (like long-pressing messages to allow added options)

       need to come back to this. Bots can only access private chats with it + chats where we add the bot into the group chat --> TODO: this can be part of the making social phase of the project

WIP challenges:

    1. sending userId to supabase was facing issues because we initialised our supabase DB to set `userId` as uuid field instead of text string. For now, we've set userId to text field, and we're not setting RLS (row level security) to use supabase auth for userId. Might have to come back to this in future.

    2. currently have doubling of metadata stored, in {metadata} + in source_chat_id / source_message_id. Should come back to rationalise in future.

things we learnt debugging today: 1. .ENV: process.env reads from system env variables, and so we had problems reading in our .env file --> use dotenv.config() instead

**27/11/24**

https://claude.ai/chat/c87934ec-744a-48b4-b003-896aa7678be2

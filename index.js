"use strict";
require("dotenv").config();
const snoowrap = require("snoowrap");
const { Telegraf } = require("telegraf");

//
// ─── SETUP ──────────────────────────────────────────────────────────────────────
//
const bot = new Telegraf(process.env.BOT_TOKEN);

const r = new snoowrap({
    userAgent: "dbot06001",
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
});
// ────────────────────────────────────────────────────────────────────────────────

// Prefijo usado en los enlaces
const prefix = "https://reddit.com";
let subreddit;
let message;

// Este bloque se ejecuta cuando el bot recive un mensaje de texto
bot.help((ctx) => ctx.reply('Send me the name of any subreddit in lowercase please :)'));

bot.on("text", (ctx) => {
    subreddit = ctx.message.text;
    message = `These are 3 top post of this week in [r/${subreddit}](${prefix +  "/r/" + subreddit}):`;

    let weekTop = r.getSubreddit(subreddit).getTop({ time: "week", limit: 3 });
    
    let links = [];

    ctx.replyWithMarkdownV2(message)

    weekTop.then((res) => {
        for (const submission of res) {
            links.push(prefix + submission.permalink);
        }

        for (const link of links) {
            ctx.reply(link);
        }
    });
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

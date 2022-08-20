// @ts-nocheck
// This file needs to be CommonJS, or at least compiled to CommonJS for it to work
// This may change in the near future, so this example is kept

// To run a Telegraf module, use:
// $> telegraf -t `BOT TOKEN` echo-bot-module.js
const { Composer, Markup } = require("telegraf");

const bot = new Composer();

bot.settings(async ctx => {
	await ctx.telegram.setMyCommands([
		{
			command: "/foo",
			description: "foo description",
		},
		{
			command: "/bar",
			description: "bar description",
		},
		{
			command: "/baz",
			description: "baz description",
		},
	]);
	return ctx.reply("Ok");
});

bot.help(async ctx => {
	const commands = await ctx.getMyCommands();
	const info = commands.reduce(
		(acc, val) => `${acc}/${val.command} - ${val.description}\n`,
		"",
	);
	return ctx.reply(info);
});

const keyboard = Markup.inlineKeyboard([
	Markup.button.url("❤️", "http://telegraf.js.org"),
	Markup.button.callback("Delete", "delete"),
]);

bot.start(ctx => ctx.replyWithDice());
bot.help(ctx => ctx.reply("Help message"));
bot.on("message", ctx => ctx.copyMessage(ctx.message.chat.id, keyboard));
bot.action("delete", ctx => ctx.deleteMessage());

module.exports = bot;

const Discord = require("discord.js");

module.exports = {
  name: "nuke",
  description: "Nukes a channel",
  usage: "nuke",
  cooldown: 0,
  run: async (client, message, args) => {
    if (!message.member.permissions.has("ADMINISTRATOR"))
      return message.reply(
        "<a:wrong:777910274011299850>You do not have the permission to do this!"
      );
    let clearchannel = message.channel || message.channel.mentions.first();
    const filter = (m) => m.author.id === message.author.id;
    let r = await message.reply(
      "Are sure you want to nuke this channel? Type: `yes` or `no`. You have 10 seconds..."
    );
    setTimeout(() => {
      r.delete();
    }, 10000);
    try {
      let collected = await message.channel.awaitMessages(filter, {
        max: 1,
        time: 10000,
      });
      if (collected.first().content === "no") {
        return message.reply("I have cancelled the nuke!");
      }
      if (collected.first().content === "yes") {
        const embed = new Discord.MessageEmbed()
          .setColor("#FF0000")
          .setTitle("Nuked!")
          .setDescription(`This channel just got nuked!!`)
          .setTimestamp();
        let ch = await clearchannel.clone();
        ch.send(embed);
        clearchannel.delete();
      }
    } catch (err) {
      message.reply("Your Time is over...");
    }
  },
};

const Discord = require('discord.js');
const settingsSch = require('../../models/sugSettings-schema')
const { emojis, colors } = require('../../assets.json')
const serverSch = require('../../models/sugServer-schema');

module.exports = {
    name: 'approve',
    description: 'Approve suggestions',
    usage: 'approve <suggestID> <reason>',
    run: async (client, message, args) => {

        const settingsData = await settingsSch.findOne({
            GuildID: message.guild.id
        });

        if (!settingsData) return message.channel.send({content: `${emojis.wrong} No suggestion settings have been set-up in this server!`})

        const suggestionChannel = message.guild.channels.cache.get(settingsData.SuggestionChannel)
        const managerRole = message.guild.roles.cache.get(settingsData.ManagerRole)

        if (!message.member.roles.cache.has(managerRole.id)) return message.channel.send({ content: `${emojis.wrong} You don\'t have proper perms!` })

        const sugID = args[0]
        if (!sugID) return message.channel.send({content: `${emojis.wrong} Please mention a suggestion ID.`})
        const serverData = await serverSch.findOne({
            GuildID: message.guild.id
        });

        const reason = args.slice(1).join(' ')
        if (!reason) return message.channel.send({content: `${emojis.wrong} Please mention a reason of approval.`})

        if (!serverData) return message.channel.send({content:`${emojis.wrong} No suggestions have been made in this server!`})
        if (serverData) {
            const suggestionExists = await serverSch.findOne({
                SuggestID: sugID
            });

            if (!suggestionExists) return message.channel.send({content: `${emojis.wrong} Couldn\'t find any suggestion with the id \`${sugID}\``})
            if (suggestionExists) {
                const suggestor = message.guild.members.cache.get(suggestionExists.Suggestor)
                const embed = new Discord.MessageEmbed()
                    .setAuthor(`Suggestion Approved!`)
                    .setDescription(suggestionExists.Suggestion)
                    .addFields({
                        name: `Reason of approval`,
                        value: reason
                    }, {
                        name: `Suggested by`,
                        value: `<@${suggestionExists.Suggestor}>`
                    })
                    .setColor(colors.successcolor)
                    .setFooter(`Approved by: ${message.author.tag}`, message.author.displayAvatarURL({
                        dynamic: true
                    }));
                const msg = await suggestionChannel.send({embeds: [embed]})
                message.channel.send({content: `<:greenTick:854228019312066571> Successfully approved suggestion.`})
                suggestor.send({content: `Your suggestion was approved!\nhttps://discord.com/channels/${message.guild.id}/${suggestionChannel.id}/${msg.id}`})
            }

        };

    }
}
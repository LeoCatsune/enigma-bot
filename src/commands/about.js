//eslint-disable-next-line no-unused-vars
const { MessageEmbed, CommandInteraction, Client } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("about")
		.setDescription("Show information about the bot."),
	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	execute: (client, interaction) => {
		const embed = new MessageEmbed()
			.setAuthor("Enigma", client.user.avatarURL({dynamic:true}))
			.setColor("BLUE")
			.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/b/bd/Enigma_%28crittografia%29_-_Museo_scienza_e_tecnologia_Milano.jpg")
			.setDescription(`A bot designed to encode and decode messages using an enigma cipher.
			While the enigma cipher now is well and truly obsolete, the way it works is still quite fascinating.`)
			.addField("Links", `[Enigma Machine](https://en.wikipedia.org/wiki/Enigma_machine) (wikipedia)
			[Invite Bot](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=274878220288&scope=bot%20applications.commands)`,true)
			.setTimestamp();
		interaction.reply({embeds:[embed]});
	}
};
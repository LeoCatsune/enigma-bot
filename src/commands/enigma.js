//eslint-disable-next-line no-unused-vars
const {	CommandInteraction, MessageEmbed, Client } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { Enigma, rotors, reflectors } = require("@janbican/enigma");
const rotorOptions = ["I","II","III","IV","V"].map(i => [i,i]);

module.exports = {
	data: new SlashCommandBuilder()
		.setName("enigma")
		.setDescription("Encodes or Decodes a message with the enigma cipher.")
		.addStringOption(o => o
			.setName("message")
			.setDescription("The message to encode or decode.")
			.setRequired(true)
		)
		.addStringOption(o => o
			.setName("left")
			.setDescription("The wheel to use for the LEFT slot.")
			.setRequired(false)
			.addChoices(rotorOptions)
		)
		.addStringOption(o => o
			.setName("middle")
			.setDescription("The wheel to use for the MIDDLE slot.")
			.setRequired(false)
			.addChoices(rotorOptions)
		)
		.addStringOption(o => o
			.setName("right")
			.setDescription("The wheel to use for the RIGHT slot.")
			.setRequired(false)
			.addChoices(rotorOptions)
		)
		.addStringOption(o => o
			.setName("reflector")
			.setDescription("The reflector to use.")
			.addChoices(["B","C"].map(i=>[i,i]))
		)
		.addStringOption(o => o
			.setName("offsets")
			.setDescription("The offsets to use for the wheels.")
			.setRequired(false)
		)
		.addStringOption(o => o
			.setName("rings")
			.setDescription("The settings to use for the rings.")
			.setRequired(false)
		)
		.addBooleanOption(o => o
			.setName("hidden")
			.setDescription("Whether or not to hide the output from the channel.")
			.setRequired(false)
		),
	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	execute: async (client, interaction) => {
		// Behold, spaghetti code.
		// I still hate the slash command options system.
		let opts = interaction.options;
		let left = opts.getString("left", false);
		let middle = opts.getString("middle", false);
		let right = opts.getString("right", false);
		let reflector = opts.getString("reflector", false);
		let offsets = opts.getString("offsets", false);
		let rings = opts.getString("rings", false);
		let message = opts.getString("message");
		let hidden = opts.getBoolean("hidden", false) || false;

		// Hey look, an ugly config block!
		try {
			const enigma = new Enigma({
				left: left ? rotors[left] : rotors.I,
				middle: middle ? rotors[middle] : rotors.II,
				right: right ? rotors[right] : rotors.III,
				reflector: reflectors[reflector] || reflectors.B,
				offsets: offsets || "AAA",
				ringSettings: rings || "AAA"
			});

			const embed = new MessageEmbed()
				.setAuthor("Enigma", client.user.avatarURL({dynamic:true}))
				.setColor("BLUE")
				.addField("LEFT Rotor", left||"I", true)
				.addField("MIDDLE Rotor", middle||"II", true)
				.addField("RIGHT Rotor", right||"III", true)
				.addField("Reflector", reflector||"B")
				.addField("Offsets", offsets||"AAA", true)
				.addField("Ring Settings", rings||"AAA", true)
				.addField("Output", "```"+enigma.convertText(message.toUpperCase())+"```")
				.setTimestamp();

			interaction.reply({embeds: [embed], ephemeral: hidden});
		} catch(e) {
			// It's most likely user error at this point.
			// If it isn't, this will throw to the command error handler.
			const embed = new MessageEmbed()
				.setAuthor("Error", client.user.avatarURL({dynamic:true}))
				.setColor("RED")
				.setDescription("Something went wrong while trying to execute that command.")
				// Yes, I did just do that. Is it ugly? Yes. Does it work? Also yes.
				.addField("Message", e.message.charAt(0).toUpperCase() + e.message.slice(1))
				.setTimestamp();
			interaction.reply({embeds: [embed], ephemeral: true});
		}
	}
};
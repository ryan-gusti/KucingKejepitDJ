const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "queue",
  alias: ["q"],
  description: "Show the music queue and now playing.",
  run: async(client, message) => {
    const serverQueue = client.queue.get(message.guild.id);

    if (!serverQueue) return message.reply("Ga ada musik yg lagi diputar. 😹").catch(console.error);
    
    let queueEmbed = new MessageEmbed()
      .setTitle("List Musik")
      .setDescription(serverQueue.songs.map((song, index) => `${index + 1}. ${song.title}`))
      .setColor("RANDOM")
      .setFooter("© Ryan GN 2020")

    queueEmbed.setTimestamp();
    return message.channel.send(queueEmbed);
  }
};

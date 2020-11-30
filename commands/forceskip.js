module.exports = {
  name:"forceskip",
  alias:["fs"],
  description: "Force skip currently song",
  run: async(client, message) => {
    const serverQueue = message.client.queue.get(message.guild.id);

    if (!message.member.voice.channel)
      return message.reply("Kamu harus join ke voice channel dulu! 😾").catch(console.error);
    if (!serverQueue)
      return message.channel.send("Ga ada musik yg lagi diputar, mau skip apaan 😹").catch(console.error);
    const { channel } = message.member.voice;
    if(channel.id !== serverQueue.channel.id) return message.reply("Kamu harus join voice channel bareng sama aku! 😾")
    serverQueue.connection.dispatcher.end();
    serverQueue.textChannel.send(`${message.author} ⏭ skipped the song`).catch(console.error);
  }
};
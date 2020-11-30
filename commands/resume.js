module.exports = {
  name: "resume",
  alias:["rsm"],
  description: "Resume currently playing music",
  run: async(client, message) => {
    const serverQueue = client.queue.get(message.guild.id);

    if (!message.member.voice.channel)
      return message.reply("Kamu harus join ke voice channel dulu! 😾").catch(console.error);
    const { channel } = message.member.voice;
    if(channel.id !== serverQueue.channel.id) return message.reply("Kamu harus join voice channel bareng sama aku! 😾")
    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      return serverQueue.textChannel.send(`${message.author} 🎵 melanjutkan musik!`).catch(console.error);
    }
    return message.reply("Ga ada musik yg lagi diputar. 😹").catch(console.error);
  }
};

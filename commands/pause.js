module.exports = {
  name: "pause",
  alias:["ps"],
  description: "Pause the currently playing music",
  run: async(client, message) => {
    if (!message.member.voice.channel)
      return message.reply("Kamu harus join ke voice channel dulu! 😾").catch(console.error);

    const serverQueue = client.queue.get(message.guild.id);
    const { channel } = message.member.voice;
    if(channel.id !== serverQueue.channel.id) return message.reply("Kamu harus join voice channel bareng sama aku! 😾")
    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
      serverQueue.connection.dispatcher.pause(true);
      return serverQueue.textChannel.send(`${message.author} ⏸ mempause musiknya.`).catch(console.error);
    }
    return message.reply("Ga ada musik yg lagi diputar. 😹.").catch(console.error);
  }
};
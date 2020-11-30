module.exports = {
  name: "stop",
  alias:["dc","leave"],
  description: "Stops the music",
  run: async(client, message) => {
    const serverQueue = client.queue.get(message.guild.id);

    if (!message.member.voice.channel)
      return message.reply("Kamu harus join ke voice channel dulu! 😾").catch(console.error);
    if (!serverQueue) return message.reply("Ga ada musik yg lagi diputar. 😹").catch(console.error);
    const { channel } = message.member.voice;
    if(channel.id !== serverQueue.channel.id) return message.reply("Kamu harus join voice channel bareng sama aku! 😾")
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
    serverQueue.textChannel.send(`${message.author} ⏹ menghentikan lagu! siap abang jago 😼`).catch(console.error);
  }
};
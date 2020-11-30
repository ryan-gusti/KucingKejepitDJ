module.exports = {
  name: "volume",
  alias: ["vol","setvol"],
  description: "Change volume of currently playing music",
  run: async(client, message, args) =>  {
    const serverQueue = client.queue.get(message.guild.id);

    if (!message.member.voice.channel)
      return message.reply("Kamu harus join ke voice channel dulu! 😾").catch(console.error);
    if (!serverQueue) return message.reply("Ga ada musik yg lagi diputar. 😹").catch(console.error);
    
    if (!args[0])
      return message.reply(`🔊 Volume musik sekarang : **${serverQueue.volume}%**`).catch(console.error);
    if (isNaN(args[0])) return message.reply("Tolong gunakan angka untuk mengatur volume.").catch(console.error);
    if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
      return message.reply("Tolong gunakan angka antara 0 - 100.").catch(console.error);
    const { channel } = message.member.voice;
    if(channel.id !== serverQueue.channel.id) return message.reply("Kamu harus join voice channel bareng sama aku! 😾")
    serverQueue.volume = args[0];
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

    return serverQueue.textChannel.send(`Volume diatur ke : **${args[0]}%**`).catch(console.error);
  }
};
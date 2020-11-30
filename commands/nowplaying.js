module.exports = {
  name: "nowplaying",
  alias:["nowplay","np"],
  description: "Get info of now playing music",
  run: async(client, message) => {
     const serverQueue = client.queue.get(message.guild.id);
    if (!serverQueue) return message.reply("Ga ada musik yg lagi diputar. 😹").catch(console.error);
    const song = serverQueue.songs[0]
      message.channel.send(`Sedang Diputar: ${song.title} dari ${song.channel}. Requested by <@${song.playUser}>`)
  }
};

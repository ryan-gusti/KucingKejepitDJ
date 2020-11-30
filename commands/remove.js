module.exports = {
  name: "remove",
  alias:["rmv"],
  description: "Remove song from the queue",
  usage:"remove <Queue Number>",
  run: async (client, message, args) => {
    if (!args.length) return message.reply(`Gunakan: ${client.prefix}${module.exports.usage}`);
    const serverQueue = client.queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send("Ga ada musik yg lagi diputar. 😹").catch(console.error);
    const { channel } = message.member.voice;
    if(channel.id !== serverQueue.channel.id || !channel) return message.reply("Kamu harus join voice channel bareng sama aku! 😾")
    const song = serverQueue.songs.splice(args[0] - 1, 1);
    serverQueue.textChannel.send(`${message.author} ❌ menghapus **${song[0].title}** dari list.`);
  }
};
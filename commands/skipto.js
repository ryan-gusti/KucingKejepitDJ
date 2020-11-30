module.exports = {
  name: "skipto",
  alias:["st","jump"],
  description: "Melewati ke nomor queue yang dipilih",
  run: async(client, message, args) => {
    if (!args.length) return message.reply(`Gunakan: ${message.client.prefix}${module.exports.name} <Queue Number>`);

    const queue = client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("Ga ada antrian.").catch(console.error);

    queue.playing = true;
    queue.songs = queue.songs.slice(args[0] - 2);
    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏭ melewati ${args[0] - 1} lagu`).catch(console.error);
  }
};
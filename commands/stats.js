const { MessageEmbed } = require("discord.js")
module.exports = {
  name: "stats",
  alias:["st"],
  description: "Display bot stats",
  run: async (client, message) => {
    const serverQueue = client.queue.get(message.guild.id);
    const uptime = require("pretty-ms")(client.uptime, { verbose:true})
    let status;
    let lup;
    const mbed = new MessageEmbed()
    .setTitle(`${client.user.username} Status`)
    .setFooter("© Ryan GN 2020")
    .setColor("RANDOM")
    .addField("Kucing bangun selama", uptime)
    if (!serverQueue) return message.channel.send(mbed).catch(console.error);
    if(serverQueue.playing === true) status = "Memutar"
    if(serverQueue.playing === false) status = "Pause"
    if(serverQueue.loop === true) lup = "Ya"
    if(serverQueue.loop === false) lup = "Tidak"
    mbed.addField("Musik", `Memutar: ${serverQueue.songs[0].title}
Antrian: ${parseInt((serverQueue.songs.length) - 1)} lagu
Di: ${serverQueue.channel.name}
Volume: ${serverQueue.volume}%
Status: ${status}
Ulang? ${lup}
Requester: <@${serverQueue.songs[0].playUser}>`)
    message.channel.send(mbed)
  }
}

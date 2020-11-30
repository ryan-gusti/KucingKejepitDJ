const discord = require("discord.js")
module.exports = {
  name: "help",
  alias:["h","?","commandlist","cmd","cmdlist"],
  description: "Show list of bot's commands",
  run: async(client, msg, args) => {
     const helpembed = new discord.MessageEmbed()
     .setTitle(client.user.username + " Command List")
     .setDescription(`Abang jago`)
     client.commands.map(cmd =>{
       helpembed.addField(`${cmd.name} (${cmd.alias})`, cmd.description)
     })
     helpembed.setColor("RANDOM")
     .setFooter("© Ryan GN 2020")
     msg.channel.send(helpembed);
  }
}

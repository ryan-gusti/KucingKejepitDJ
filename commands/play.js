const { play } = require("../handler/play.js");
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(process.env.YT_KEY); 

module.exports = {
  name:"play",
  alias:["p"],
  description:"Play youtube music",
  usage:"play <song name> / play <song url>",
  run: async(client, msg, args) => {
    const { channel } = msg.member.voice;
     if(!args.length) return msg.reply(`Ga ada argument yg diterima. Coba ${client.prefix}${module.exports.usage}`)
     if (!channel) return msg.reply("Kamu harus ada di voice channel dulu HUMAN! 😾").catch(console.error);

    const permissions = channel.permissionsFor(client.user);
    if (!permissions.has("CONNECT")) return msg.reply("Aku gabisa masuk ke voice channel, Coba cek permissionnya! 😿");
    if (!permissions.has("SPEAK")) return msg.reply("Aku gabisa nyanyi di voice channel ini, pastiin permissionnya! 😿");
    
    const search = args.join(" ");
    const videoPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
    const url = args[0];
    const urlValid = videoPattern.test(args[0]);

    // Start the playlist if playlist url was provided
    if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
      return client.commands.get("playlist").run(client, msg, args);
    }

    const serverQueue = client.queue.get(msg.guild.id);
    const queueConstruct = {
      textChannel: msg.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 100,
      playing: true
    };
    
    let song = null
    let songInfo = null
    
    if (urlValid) {
      try {
        songInfo = await ytdl.getInfo(url);
        song = {
          title: songInfo.videoDetails.title,
          channel:songInfo.videoDetails.author.name,
          url:songInfo.videoDetails.video_url,
          playUser:msg.author.id,
          vote:[]
        };
      } catch (error) {
       console.error(error)
      }
      } else {
      try {
        const results = await youtube.searchVideos(search, 1);
        songInfo = await ytdl.getInfo(results[0].url);
        song = {
          title: songInfo.videoDetails.title,
          channel:songInfo.videoDetails.author.name,
          url:songInfo.videoDetails.video_url,
          playUser:msg.author.id,
          vote:[]
        };
      } catch (error) {
        console.error(error);
        return msg.reply("Ga ditemukan video musik dengan judul tersebut! 😾").catch(console.error);
      }
    }
    
    if (serverQueue) { 
      //return if member voice not same as bot
      if(channel.id !== serverQueue.channel.id) return msg.reply("Kamu harus join voice channel bareng sama aku! 😾")
      serverQueue.songs.push(song);
      return serverQueue.textChannel
        .send(`✅ **${song.title}** sudah ditambahkan ke list oleh ${msg.author}`)
        .catch(console.error);
    } else {
      queueConstruct.songs.push(song);
    }

    if (!serverQueue) client.queue.set(msg.guild.id, queueConstruct);
    if (!serverQueue) {
      try {
        queueConstruct.connection = await channel.join();
        play(queueConstruct.songs[0], client, msg);
        
      } catch (error) {
        console.error(`Could not join voice channel: ${error}`);
        client.queue.delete(msg.guild.id);
        await channel.leave();
        return msg.channel.send(`Gabisa join ke voice channel 😿: ${error}`).catch(console.error);
      }
    }
  }
}

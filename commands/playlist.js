const { MessageEmbed } = require("discord.js");
const { play } = require("../handler/play.js");
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(process.env.YT_KEY);

module.exports = {
  name: "playlist",
  alias:["pl"],
  description: "Play a playlist from youtube",
  usage:"playlist <playlist url> / playlist <playlist name>",
  run: async(client, message, args) => {
    const { channel } = message.member.voice;

    if (!args.length)
      return message
        .reply(`No argument submitted, Try ${client.prefix}${module.exports.usage}`)
        .catch(console.error);
    if (!channel) return message.reply("Kamu harus join ke voice channel dulu! 😾").catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.reply("Aku gabisa masuk ke voice channel, Coba cek permissionnya! 😿");
    if (!permissions.has("SPEAK"))
      return message.reply("Aku gabisa nyanyi di voice channel ini, pastiin permissionnya! 😿");

    const search = args.join(" ");
    const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
    const url = args[0];
    const urlValid = pattern.test(args[0]);

    const serverQueue = message.client.queue.get(message.guild.id);
    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 100,
      playing: true
    };

    let song = null;
    let playlist = null;
    let videos = [];

    if (urlValid) {
      try {
        playlist = await youtube.getPlaylist(url);
        videos = await playlist.getVideos()
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const results = await youtube.searchPlaylists(search, 1);
        playlist = results[0];
        videos = await playlist.getVideos(25);
      } catch (error) {
        console.error(error);
      }
    }

    videos.forEach( async (video) => {
      const songInfo = await ytdl.getInfo(`https://www.youtube.com/watch?v=${video.id}`)
      song = {
          title: songInfo.videoDetails.title,
          channel:songInfo.videoDetails.author.name,
          url:songInfo.videoDetails.video_url,
          playUser:message.author.id,
          vote:[]
      };
      if (serverQueue) {
        serverQueue.songs.push(song);
        if(channel.id !== serverQueue.channel.id) return message.reply("You need join same voice channel with me!")
        message.channel
            .send(`✅ **${song.title}** sudah ditambahkan ke queue oleh ${message.author}`)
            .catch(console.error);
      } else {
        queueConstruct.songs.push(song);
      }
    });

    
    if (!serverQueue) message.client.queue.set(message.guild.id, queueConstruct);
    
    if (!serverQueue) {
      try {
        const connection = await channel.join();
        queueConstruct.connection = connection;
        play(queueConstruct.songs[0],client, message);
      } catch (error) {
        console.error(`Could not join voice channel: ${error}`);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel.send(`Gabisa join ke channel: ${error}`).catch(console.error);
      }
    }
  }
};
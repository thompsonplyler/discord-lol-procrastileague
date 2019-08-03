const Discord = require('discord.js');
const client = new Discord.Client();


client.on('ready', () => {
    var generalChannel = client.channels.get("486539893485600771") // Replace with known channel ID
    generalChannel.send("Don't mind me. I'm just a bot learning to talk.")  
})


// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"
const botSecretToken = 'NjA2ODg3MDQxMjUwMzYxMzg4.XUSk_w.UpseijmJwkhGlryzoqtbu0BgVQA';

client.login(botSecretToken)
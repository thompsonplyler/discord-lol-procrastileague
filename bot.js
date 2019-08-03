const Discord = require('discord.js');
const fetch = require('node-fetch');

const client = new Discord.Client();

client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user) { // Prevent bot from responding to its own messages
        return
    }

    if (receivedMessage.content.startsWith("$")) {
        processCommand(receivedMessage)
    }
})

const processCommand = (receivedMessage) => {
    let fullCommand = receivedMessage.content.substr(1) // Remove the leading exclamation mark
    let splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space
    let primaryCommand = splitCommand[0] // The first word directly after the exclamation is the command
    let arguments = splitCommand.slice(1) // All other words are arguments/parameters/options for the command

    console.log("Command received: " + primaryCommand)
    console.log("Arguments: " + arguments) // There may not be any arguments

    if (primaryCommand == "timer") {
        timerCommand(arguments, receivedMessage)
    } else {
        receivedMessage.channel.send("I don't understand the command. Try `$timer`.")
    }
}

const timerCommand = (arguments, receivedMessage) => {


    if (arguments.length > 0) {
        fetch(`http://localhost:3000/api/v1/timers/?summoner_name=${arguments}`, {
                method: "POST"
            })
            .then(r => r.json())
            .then(response => receivedMessage.channel.send(`${arguments} has played League of Legends today for ${response}.`))
        // receivedMessage.channel.send(`You have supplied ${arguments} as an argument`)
    } else {
        receivedMessage.channel.send("The command was received, but this command requires an argument to function.")
    }
}


// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"
const botSecretToken = 'NjA2ODg3MDQxMjUwMzYxMzg4.XUSk_w.UpseijmJwkhGlryzoqtbu0BgVQA';

client.login(botSecretToken)
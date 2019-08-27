const Discord = require('discord.js');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();

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
    } 
    else {
        receivedMessage.channel.send("I don't understand the command. Try `$timer`.")
    }
}

const timerCommand = (arguments, receivedMessage) => {
    

    if (arguments.length > 0) {
        fetch(`http://localhost:3001/api/v1/timer/?summoner_name=${arguments}`, {
                method: "POST"
            })
            .then(r => r.json())
            .then(response => {
                
                envCheck()
                
                if (response["status"] === 500){
                    return receivedMessage.channel.send("Your request was refused by Riot's API. This is probably because my developer key expired. Please contact <@230371156111130624> about resolving this.")
                } 
                else {
                    return receivedMessage.channel.send(`${arguments} has played League of Legends today for ${response[1]}.\n${arguments} has won ${winCount(response[0])}% of total games played today.`)
                }
            
            }
            )
            .catch(e=>console.log("Got an error."))
    } 
    else {
        receivedMessage.channel.send("The command was received, but this command requires an argument to function.")
    }
}

const envCheck = () => {
    console.log(process.env.BOT_CODE)
}
const winCount = (data) =>{
    const gameTotal = data.length
    const wonGames = data.filter(game => game=="Win").length
    const percentage = wonGames/gameTotal

    return (percentage) ? Math.floor(percentage*100) : "0"

}

// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"
const botSecretToken = 'NjA2ODg3MDQxMjUwMzYxMzg4.XUSk_w.UpseijmJwkhGlryzoqtbu0BgVQA';

client.login(botSecretToken)
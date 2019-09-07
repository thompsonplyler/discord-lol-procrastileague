const Discord = require('discord.js');
const fetch = require('node-fetch');
const moment = require('moment');

const client = new Discord.Client();

client.on('message', (receivedMessage) => {
  if (receivedMessage.author === client.user) { // Prevent bot from responding to its own messages
    return;
  }

  if (receivedMessage.content.startsWith('$')) {
    processCommand(receivedMessage);
  }
});

const processCommand = (receivedMessage) => {
  const fullCommand = receivedMessage.content.substr(1); // Remove the leading dollar sign
  const splitCommand = fullCommand.split(' '); // Split the message up in to pieces for each space
  const primaryCommand = splitCommand[0]; // The first word directly after the dollar sign is the command
  const firstArgument = splitCommand[1]; // All other words are arguments/parameters/options for the command
  const secondArgument = splitCommand.slice(2).join(' '); // 

  console.log('Command received: ' + primaryCommand);
  if (firstArgument) {console.log('Region: ' + firstArgument)}; // There may not be any arguments
  if (secondArgument) {console.log('Argument:' + secondArgument)};

  if (primaryCommand == 'timer') {
    timerCommand(firstArgument, secondArgument, receivedMessage);
  } else if (primaryCommand == 'moment') {
    momentCommand(firstArgument);
  } else {
    receivedMessage.channel.send("I don't understand the command. Try `$timer`.");
  }
};

const momentCommand = (value) => {
  const now = moment();
  let day = now.add(value,'days').day();
  switch (day) {
    case 0:
      day = 'Sunday';
      break;
    case 1:
      day = 'Monday';
      break;
    case 2:
      day = 'Tuesday';
      break;
    case 3:
      day = 'Wednesday';
      break;
    case 4:
      day = 'Thursday';
      break;
    case 5:
      day = 'Friday';
      break;
    case 6:
      day = 'Saturday';
      break;
    default:
      day = 'Sunday';
  }
  console.log(day)
  return day;
};

const timerCommand = (region, argument, receivedMessage) => {
  argument = encodeURIComponent(argument);

  if (argument.length > 0) {
    fetch(`http://localhost:3001/api/v1/timer/?summoner_name=${argument}&region=${region}`, {
      method: 'POST'
    })
      .then(r => r.json())
      .then(response => {
        argument = decodeURIComponent(argument);
        responseHandler(response, receivedMessage, argument);
        
      }
      )
      .catch(error=>console.log('This is the error you received: ' + error));
    
  } else {
    receivedMessage.channel.send('The command was received, but this command requires an argument to function.');
  }
};

const responseHandler = (data, receivedMessage, argument) => {
  
  if (data.grand_total_time === '00 hours 00 minutes and 00 seconds') {
    receivedMessage.channel.send(`**Weekly Results for Summoner:** ${argument}\nThis summoner hasn't played any games this week.`);
  } else{
    receivedMessage.channel.send(
      `**Weekly Results for Summoner:** ${argument}\n${handleToday(data)}\n${handleYesterday(data)}\n${handleMinusTwo(data)}\n${handleMinusThree(data)}\n${handleMinusFour(data)}\n${handleMinusFive(data)}\n${handleMinusSix(data)}
\n**Time Played This Week:** ${data.grand_total_time}\n**Win Percentage:** ${winCount(data.grand_total_results)}%`
    );
  }
};

const handleToday = (data) => {
  console.log(data.today.total_time);
  if (data.today.total_time === '00 hours 00 minutes and 00 seconds') {
    return '**Today:** No games played.';
  } else {
    return `**Today:** Played for ${data.today.total_time} -- Won ${winCount(data.today.results)}% of total games played.`;
  }
};

const handleYesterday = (data) => {
  if (data.minus_one.total_time === '00 hours 00 minutes and 00 seconds') {
    return '**Yesterday:** No games played.';
  } else {
    return `**Yesterday:** ${data.minus_one.total_time} -- Won ${winCount(data.minus_one.results)}% of total games played.`;
  }
};

const handleMinusTwo = (data) => {
  if (data.minus_two.total_time === '00 hours 00 minutes and 00 seconds') {
    return `**${momentCommand(-2)}:** No games played.`;
  } else {
    return `**${momentCommand(-2)}:** ${data.minus_two.total_time} -- Won ${winCount(data.minus_two.results)}% of total games played`;
  }

};

const handleMinusThree = (data) => {
  if (data.minus_three.total_time === '00 hours 00 minutes and 00 seconds') {
    return `**${momentCommand(-3)}:** No games played.`;
  } else {
    return `**${momentCommand(-3)}:** ${data.minus_three.total_time} -- Won ${winCount(data.minus_three.results)}% of total games played`;
  }
};

const handleMinusFour = (data) => {
  if (data.minus_four.total_time === '00 hours 00 minutes and 00 seconds') {
    return `**${momentCommand(-4)}:** No games played.`;
  } else {
    return `**${momentCommand(-4)}:** ${data.minus_four.total_time} -- Won ${winCount(data.minus_four.results)}% of total games played`;
  }

};

const handleMinusFive = (data) => {
  if (data.minus_five.total_time === '00 hours 00 minutes and 00 seconds') {
    return `**${momentCommand(-5)}:** No games played.`;
  } else {
    return `**${momentCommand(-5)}:** ${data.minus_five.total_time} -- Won ${winCount(data.minus_five.results)}% of total games played`;
  }

};

const handleMinusSix = (data) => {
  if (data.minus_six.total_time === '00 hours 00 minutes and 00 seconds'){
    return `**${momentCommand(-6)}:** No games played.`;
  } else {
    return `**${momentCommand(-6)}:** ${data.minus_six.total_time} -- Won ${winCount(data.minus_six.results)}% of total games played`;
  }
};

const winCount = (data) => {
  const gameTotal = data.length;
  const wonGames = data.filter(game => game == 'Win').length;
  const percentage = wonGames / gameTotal;

  if (percentage) {
    return Math.floor(percentage * 100);
  } return '0';
};


const botSecretToken = 'NjA2ODg3MDQxMjUwMzYxMzg4.XUSk_w.UpseijmJwkhGlryzoqtbu0BgVQA';

client.login(botSecretToken);
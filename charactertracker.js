const prefix = "!"; // Set bot prefix here

const request = require('request');
const Discord = require("discord.io"); // Load discord.io
const bot = new Discord.Client({ // Load bot
    token: "NDQ5MDczNzQ4MjE0MTUzMjE3.Deffbg.U2S65pgJy6DC-FYgZS8IWnykwJ0",
    autorun: true
});

var tarServer, tarRegion, tarCharacter, logsKey, tarMetric, pctSum, pctRank, avgRank, logs, returnString;

const stdin = process.stdin;         // Use the terminal to run JS code
stdin.on("data", function(input) {
    input = input.toString();
    try {       // Attempt to run input
        let output = eval(input);
        console.log(output);
    } catch (e) {       // Failed
        console.log("Error in eval.\n"+e.stack);
    }
});

bot.on("ready", function() { // When the bot comes online...
    console.log("I'm online!");
});

bot.on("message", function(user, userID, channelID, message, event) { // Message detected
    if (message.startsWith(prefix)) { // Message starts with prefix
        let command = message.slice(prefix.length).split(" "); // Split message into words
        switch (command[0]) { // Execute code depending on first word
        case "ping": // ping: reply "pong"
            bot.sendMessage({to: channelID, message: "Pong!"});
            break;
        case "roll": // roll: choose a random number
            let max = parseInt(command[1]) || 100;
            let min = 1;
            let result = Math.floor(Math.random()*(max-min+1)+min);
            bot.sendMessage({to: channelID, message: "From "+min+" to "+max+", you rolled: **"+result+"**"});
            console.log("From "+min+" to "+max+", you rolled: **"+result+"**");
            break;
        case "tracknick":
            
            tarServer = "sargeras";
            tarRegion = "US";
            tarCharacter = "kfcbaer";
            logsKey = "879f290422d74824299a945f46eefca3";
            tarMetric = "dps";
            var apiURL = "https://www.warcraftlogs.com:443/v1/rankings/character/" + tarCharacter + "/" + tarServer + "/" + tarRegion + "?metric=" + tarMetric + "&api_key=" + logsKey;
            pctSum = 0;
            pctRank = 0;

            request.get({
                url: apiURL,
                json: true,
                headers: {"User-Agent": "request"} },
                (err, res, data) => {
                    if (err)
                    {
                        console.log("Error:", err);
                    }
                    else if (res.statusCode !== 200)
                    {
                        console.log("Status:", res.statusCode);
                    }
                    else
                    {
                        logs = data;
                        console.log("Retrieved data!");
                        parseData(logs);
                        bot.sendMessage({to: channelID, message: returnString});
                    }
            });
            break;
            
        }
    }
});


function parseData(userRankings) {
    console.log("Found " + userRankings.length + " reports for "+ tarCharacter + ".");
    
    for(var i = 0; i < userRankings.length; i++) {

        var userRanking = userRankings[i];
        var date = new Date((userRanking.startTime));
        pctRank = (userRanking.rank / userRanking.outOf) * 100;
        pctSum += pctRank;
        
        console.log(pctRank);
        console.log(date);
        console.log("Ranking: " + userRanking.rank + " out of " + userRanking.outOf + ". Percentile ranking: " + pctRank.toFixed());
        
    }

    avgRank = (pctSum / userRankings.length).toFixed();
    returnString = (tarCharacter + " has an average percentile rank of " + avgRank + " for " + tarMetric + ".");
    console.log(tarCharacter + " has an average percentile rank of " + avgRank + " for " + tarMetric + ".");

 /* <!--   bot.sendMessage({to: channelID, message: returnString});     

    document.getElementById("avgRanking").innerHTML = returnString;   */
    
}


bot.on("disconnect", function() { // Occasionally the bot disconnects.
    bot.connect(); // Just reconnect when that happens.
});
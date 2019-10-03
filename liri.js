
require("dotenv").config();
// Import the node-spotify-api NPM package.
var Spotify = require("node-spotify-api");
var axios = require("axios");
var moment = require("moment");
// Import the API keys
// var keys = require("./keys");
// Import the request npm package.
var request = require("request");
// Import the FS package for read/write.
var fs = require("fs");
// Initialize the spotify API client with keys
// var format = require('date-format');
const chalk = require('chalk');
// var searchBands = function (band) {
//     var city = "";
//     var queryURL = "https://rest.bandsintown.com/artists/" + band.replace(" ", "+") + "/events?app_id=codingbootcamp"
//     console.log(queryUrl);

// };

var Spotify = require('node-spotify-api');

var spotify = new Spotify({
    id: process.env.SPOTIFY_USER_ID,
    secret: process.env.SPOTIFY_API_KEY
});

//Stored argument's array
var nodeArgv = process.argv;
console.log(nodeArgv);
var command = process.argv[2];
//movie or song
//attaches multiple word arguments
var inputPara = process.argv.slice(3).join(" ");
console.log(chalk.bold.magenta("You searched for: ") + inputPara);
//switch case
switch (command) {
    case "spotify":
        if (inputPara == undefined || inputPara == "") {
            //* If no song is provided then your program will default to "The Sign" by Ace of Base.
            inputPara = "The Sign Ace of Base";
        }
        spotifySong(inputPara);
        break;

    case "movie":
        if (inputPara == undefined || inputPara == "") {
            inputPara = "Frozen";
        }
        omdbData(inputPara);
        break;

    case "band":
        if (inputPara == undefined || inputPara == "") {
            inputPara = "Casting Crows";
        }
        concert(inputPara);
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        console.log(chalk.bold.bgRed("{Please enter a command: spotify, movie, band or do-what-it-says"));
        break;
}

function spotifySong(song) {
    spotify.search({ type: 'track', query: song, limit: 1 }, function (error, data) {
        if (!error) {
            for (var i = 0; i < data.tracks.items.length; i++) {
                var songData = data.tracks.items[i];
                //artist
                console.log(chalk.green.bold("Artist: ") + songData.artists[0].name);
                //song name
                console.log(chalk.blue.bold("Song: ") + songData.name);
                //spotify preview link
                console.log(chalk.yellow.bold("Preview URL: ") + songData.preview_url);
                //album name
                console.log(chalk.magenta.bold("Album: ") + songData.album.name);
            }
        } else {
            console.log('Error!');
        }
    });
};

function omdbData(movie) {
    var queryUrl = "http://www.omdbapi.com/?t=" + movie.split(' ').join('+') + "&y=&plot=short&apikey=trilogy";
    console.log(movie.split(' ').join('+'));

    axios.get(queryUrl)
        .then(function (response) {
            // If the axios was successful...
            // Then log the body from the site!
            console.log(chalk.whiteBright.bgMagenta("-----------------------------------------\n"));
            console.log(chalk.bold.green("\n * Title of the movie: ") + response.data.Title);
            console.log(chalk.bold.magenta("\n * Year the movie came out: ") + response.data.Year);
            console.log(chalk.bold.cyan("\n * IMDB Rating: ") + response.data.Ratings[0].Value);
            console.log(chalk.bold.yellow("\n * Rotten Tomatoes Rating: ") + response.data.Ratings[1].Value);
            console.log(chalk.bold.magenta("\n * Country where the movie was produced: ") + response.data.Country);
            console.log(chalk.bold.white("\n * Language(s): ") + response.data.Language);
            console.log(chalk.bold.blue("\n * Plot of the movie: ") + response.data.Plot);
            console.log(chalk.bold.green("\n * Actors: ") + response.data.Actors + "\n");
            console.log(chalk.whiteBright.bgMagenta("-------------------------------------------\n"));
        })
        //otherwise log error - Followhe docs.
        .catch(function (error) {
            console.log(chalk.red(error));
            //  loggingAllData(error);
        }
        );
}
function concert(band) {
    var queryUrl = "https://rest.bandsintown.com/artists/" + band.split(" ").join("+") + "/events?app_id=codingbootcamp";
    axios.get(queryUrl)
        .then(function (response) {

            var loopCount = 0;  //Limit DAT to 5 EVENTS MAX 
            if (response.data.length > 5) {
                loopCount = 5;
            }
            else {
                loopCount = response.data.length;
            }

            for (var i = 0; i < loopCount; i++) {
                console.log(chalk.whiteBright.bgBlue("---------------EVENT Details ---------------\n"));
                console.log(chalk.bold("Name of the venue: ") + response.data[i].venue.name);
                console.log(chalk.bold("\n Venue Location: ") + response.data[i].venue.city);
                //Using Moment to format Date 
                console.log(chalk.bold("\n Date of the Event: ") + moment(response.data[i].datetime).format('MM-DD-YYYY'));
                console.log(chalk.whiteBright.bgBlue("----------------------------------------\n"));
            }
        })
        .catch(function (error) {
            console.log(chalk.red(error));
        }
        );
}
function doWhatItSays() {
    console.log("do-what-it-says");
    //reads values from random.txt file
    fs.readFile("random.txt", "utf8", function (error, data)
    {
//    reading data from the file
        console.log(data); 
    var dataArr = data.split(",");
   // We are passing the song name from split array
   if (dataArr[1] !== '') {
     spotifySong(dataArr[1]);
   }
   });
}
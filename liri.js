// ----------
// Load packages
require("dotenv").config();
var axios = require("axios");
var fs = require("fs");
var keys = require("./keys.js");
var moment = require('moment');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);


// ----------
// Vars

var divider = "\n------------------------------------------------------------\n";

// First arguments is the action:  "concert", "movie-this", etc...
// Second arguments are the input values: "song name", "movie name", etc...
var action = process.argv[2];
var inputValues = process.argv.slice(3).join(" ");


// ----------
// Switch-case to direct which function gets run.

switch (action) {
  case "concert-this":
    concert(inputValues);
    break;
  case "spotify-this-song":
    spotifyThis(inputValues);
    break;
  case "movie-this":
    movieThis(inputValues);
    break;
  case "do-what-it-says":
    doThis();
    break;
  default:
    var showCommands = [
      `Ooppss.... unrecognized command. \n${divider}`,
      `Available commands are : \n"concert-this" <artist-name> \n"spotify-this-song" <song-name>`,
      `"movie-this" <movie-name> \n"do-what-it-says" <file.txt> \n${divider}`
    ].join('\n');
    console.log(showCommands);
    break;
};


// ----------
// Main Logic for each function

function concert(inputValues) {
  debugger;
  // Default value
  if (!inputValues) {
    inputValues = "Maroon 5";
  }
  console.log(`\n----------------- Searching concerts for "${inputValues}" -----------------\n`)

  // Search events for artists using the Bands in Town Artist Events API and axios
  var queryUrl = "https://rest.bandsintown.com/artists/" + inputValues + "/events?app_id=codingbootcamp";

  axios.get(queryUrl).then(function (response) {
    var jsonData = response.data;
    var showData = '';
    // console.log(response);
    // console.log('------')
    // console.log(jsonData);
    // console.log('------')
    // console.log(jsonData == "\n{warn=Not found}\n");

    if (jsonData === undefined || jsonData.length === 0) {
      showData = '\n----- Oopss.. no results available for that query. -----\n';
      console.log('haha -----')

      //  Print info to terminal
      console.log(showData + divider);
      // Append showData and the divider to log.txt
      fs.appendFile("log.txt", showData + divider, function (err) {
        if (err) throw err;
      });
    } else {
      // Loop through all results
      for (var x = 0; x < jsonData.length; x++) {
        var momentDate = moment(jsonData[x].datetime).format("dddd, l hh:mm A");

        // showData is a string containing the show data we will print to the console
        showData = [
          `Venue: ${jsonData[x].venue.name}`,
          `Location:  ${jsonData[x].venue.city}, ${jsonData[x].venue.country}`,
          `Date: ${momentDate}`
        ].join('\n');

        //  Print info to terminal
        console.log(showData + divider);
        // Append showData and the divider to log.txt
        fs.appendFile("log.txt", showData + divider, function (err) {
          if (err) throw err;
        });
      }
    }
    })
    .catch(function (error) {
      console.log('haha -----')
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        // console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an object that comes back with details pertaining to the error that occurred.
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      // console.log(error.config);
    });
}


function spotifyThis(inputValues) {
  // Default value
  if (!inputValues) {
    inputValues = "Girls Like You";
  }
  console.log(`\n----------------- Searching Spotify for "${inputValues}" -----------------\n`)

  // Search the song from spotify api
  spotify.search({ type: 'track', query: inputValues})
    .then(function (response) {
      console.log(inputValues);
      var jsonData = response.tracks.items;
      if (jsonData === undefined || jsonData.length === 0) {
        showData = '\n----- Oopss.. no results available for that query. -----\n';

        //  Print info to terminal
        console.log(showData + divider);
        // Append showData and the divider to log.txt
        fs.appendFile("log.txt", showData + divider, function (err) {
          if (err) throw err;
        });
      } else {
        // Loop through results and limit results to 5
        for (var x = 0; x < 5; x++) {
          // get multiple artists
          var artistsNameList = [];
          for (var j = 0; j < jsonData[x].artists.length; j++) {
            artistsNameList.push(jsonData[x].artists[j].name)
          }
          var artistsName = artistsNameList.join(', ');

          // showData is a string containing the show data we will print to the console
          var showData = [
            `Artist(s): ${artistsName}`,
            `Song Name:  ${jsonData[x].name}`,
            `Spotify Preview:  ${jsonData[x].external_urls.spotify}`,
            `Album: ${jsonData[x].album.name}`
          ].join('\n');

          //  Print info to terminal
          console.log(showData + divider);
          // Append showData and the divider to log.txt
          fs.appendFile("log.txt", showData + divider, function (err) {
            if (err) throw err;
          });
      }
    }
    })
    .catch(function (err) {
      console.log(err);
    });

}


function movieThis(inputValues) {
  // Default value
  var noInput = '';
  if (!inputValues) {
    inputValues = "Mr. Nobody";
    noInput = [
      "\n\nIf you haven't watched 'Mr. Nobody', then you should: http://www.imdb.com/title/tt0485947/",
      "It's on Netflix!"
    ].join('\n')
  }
  console.log(`\n----------------- Searching Movie "${inputValues}" -----------------\n`)

  var queryUrl = "http://www.omdbapi.com/?t=" + inputValues + "&y=&plot=short&apikey=trilogy";

  // Search move using OMDB axios
  axios.get(queryUrl).then(function (response) {
    // Place the response.data into a variable, jsonData.
    var jsonData = response.data;
    if (jsonData.Response === 'False' || jsonData.Error === 'Movie not found') {
      showData = '\n----- Oopss.. no results available for that query. -----\n';

      //  Print info to terminal
      console.log(showData + divider);
      // Append showData and the divider to log.txt
      fs.appendFile("log.txt", showData + divider, function (err) {
        if (err) throw err;
      });
    } else {

      // get rotten tomatoes rating
      var rtRating = '';
      for (var x = 0; x < jsonData.Ratings.length; x++) {
        if (jsonData.Ratings[x].Source === 'Rotten Tomatoes') {
          rtRating = jsonData.Ratings[x].Value
          break;
        }
      }
      if (!rtRating){
        rtRating = 'N/A'
      }
      // showData ends up being the string containing the show data we will print to the console
      var showData = [
        `Title: ${jsonData.Title}`,
        `Year: ${jsonData.Year}`,
        `Rating - IMDB: ${jsonData.imdbRating}`,
        `Rating - Rotten Tomatoes:  ${rtRating}`,
        `Country: ${jsonData.Country}`,
        `Language: ${jsonData.Language}`,
        `Actors: ${jsonData.Actors}`,
        `Plot: \n${jsonData.Plot}`
      ].join("\n");

      //  Print info to terminal
      console.log(showData + noInput + divider);
      // Append showData and the divider to log.txt
      fs.appendFile("log.txt", showData + noInput + divider, function (err) {
        if (err) throw err;
      });
    }
    })
    .catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        // console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an object that comes back with details pertaining to the error that occurred.
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      // console.log(error.config);
    });

}


function doThis() {
  console.log(`\n----------------- Searching based on "random.txt" commands -----------------\n`)

  fs.readFile("random.txt", "utf8", function (error, data) {
    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }
    // remove double quotes and split by comma
    var dataArr = data.replace(/['"]+/g, '').split(",");
    action = dataArr[0];
    inputValues = dataArr[1];

    // Call appropriate function based on input
    switch (action) {
      case "concert-this":
        concert(inputValues);
        break;
      case "spotify-this-song":
        spotifyThis(inputValues);
        break;
      case "movie-this":
        movieThis(inputValues);
        break;
    };
  });
}

# LIRI Node App
Welcome to LIRI!
LIRI stands for Language Interpretation and Recognition Interface.
LIRI is a command line node application that takes in arguments and returns the appropriate results.


### Pre-requisites

This app requires node js and a few npm packages to be installed, as well as necessary spotify credentials to be generated prior to running the app.

* Install npm packages below.

```
npm install axios
npm install dotenv
npm install moment
npm install node-spotify-api
```
* Generate spotify api credentials following these links
https://developer.spotify.com/my-applications/#!/
https://developer.spotify.com/my-applications/#!/applications/create


### Usage

LIRI returns different information based on the available commands argument below.
```
node liri.js concert-this <artist/band name here>
node liri.js spotify-this-song '<song name here>'
node liri.js movie-this '<movie name here>'
node liri.js do-what-it-says
```

1. Concerts

This will search the Bands in Town Artist Events API ("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp") for an artist and render the following information about each event to the terminal:
  ```
  * Name of the venue
  * Venue location
  * Date of the Event (use moment to format this as "MM/DD/YYYY")
  ```
If no artist is provided then it will default to "Maroon 5".

Commands Preview:
![concert-this](concert.gif)


2. Spotify Songs

This will show the following information about the song in your terminal/bash window and the results are limited to 5.
  ```
  * Artist(s)
  * The song's name
  * A preview link of the song from Spotify
  * The album that the song is from
  ```
If no song is provided then it will default to "Girls Like You" by Maroon 5.

Commands Preview:
![spotify-this-song](spotify.gif)


3. Movie Information

This will output the following information to your terminal/bash window.
  ```
  * Title of the movie.
  * Year the movie came out.
  * IMDB Rating of the movie.
  * Rotten Tomatoes Rating of the movie.
  * Country where the movie was produced.
  * Language of the movie.
  * Plot of the movie.
  * Actors in the movie.
  ```
If the user doesn't type a movie in, it will output data for the movie 'Mr. Nobody.'

Commands Preview:
![movie-this](movie.gif)


3. Do What It Says

LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
This is what random.txt file looks like.
```
rever:~/NW/git-nw/liri-node-app (master)$ echo $(cat random.txt)
spotify-this-song,"I Want it That Way"
```
It will run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
Try editing the text in random.txt to test out other commands based on your preference.


Commands Preview:
![do-what-it-says](dothis.gif)

### Technology

Technology used:
JavaScript, Node.js, Axios, Bands in Town Artist Events API, Spotify API, OMDB API, and moment.js
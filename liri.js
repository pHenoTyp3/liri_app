require("dotenv").config();

var keys = require("./keys.js");
var request = require("request");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
// var APP_ID = 

// var bandsintown = require('bandsintown')(APP_ID);
var fs = require("fs");
var queryterm = process.argv[2];
console.log(queryterm);
var searchterm = "";
for (var i = 3; i < process.argv.length; i++) {
    searchterm += process.argv[i] + " "
};
console.log(searchterm);
if (queryterm === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            console.log(error)
        }
        dataArr = data.split(",")
        console.log(dataArr)
        searchterm = dataArr[1]
        queryterm = dataArr[0]
        dowhatitsays(searchterm, queryterm)
    })
} else {
    dowhatitsays(searchterm, queryterm)
}


function moviethis(searchterm) {
    request("http://www.omdbapi.com/?t=" + searchterm + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

        if (error && response.statusCode === 200) {
            console.log(error)

            // return console.log(error)
        } else if (!error) {
            // console.log(body)
            console.log("Movie Title is: " + JSON.parse(body).Title)
            console.log("Movie Release Year is: " + JSON.parse(body).Released)
            console.log("Movie Rotten Tomatos Rating is: " + JSON.parse(body).Ratings[1].Value)
            console.log("Movie IMDB rating is: " + JSON.parse(body).imdbRating)
            console.log("Movie was produced in: " + JSON.parse(body).Country)
            console.log("Movie Language is: " + JSON.parse(body).Language)
            console.log("Movie Plot is: " + JSON.parse(body).Plot)
            console.log("Movie Actors are: " + JSON.parse(body).Actors)
            
        }
    })
}

function concertthis(searchterm) {
    
    // var bandsintown = require("https://rest.bandsintown.com/artists/" + searchterm + "/events?app_id=codingbootcamp")

// console.log(bandsintown.events)

// request("https://rest.bandsintown.com/artists/" + searchterm + "/events?app_id=codingbootcamp", function(error,data){
//     if(error){
//         return console.log(error)
//     } else {
//         console.log(data)
//     }
// })
// }
///////////////////////ABOVE: Working using url provided/////////////////////////////
///////////////////////BELOW: Working url npm documentation//////////////////////////
var bandsintown = require('bandsintown')("codingbootcamp");    
bandsintown.getArtistEventList(searchterm)
        .then(function (events) {
          
            for(var i = 0; i < events.length; i++){
                var eventvenue = events[i].venue
                var eventdate = events[i].formatted_datetime
                console.log("Venue Name: " + eventvenue.name)
                console.log("City: " + eventvenue.city)
                console.log("Region: " + eventvenue.region)
                console.log("Country: " + eventvenue.country)
                console.log("Start Date: " + eventdate)
            
        }
        });
}

function spotifythis(searchterm) {
    spotify.search({
        type: "track",
        query: searchterm
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        } else {

           
            var artist = data.tracks.items[0]
            console.log("Song title: " + artist.name) //song title name
            console.log("Artist Name: " + artist.artists[0].name) // artist name
            console.log("Album Name: " + artist.album.name) // album name
            console.log("Check out a preview: " + artist.preview_url) // preview url
            console.log("Full song on Spotify: " + artist.external_urls.spotify); // full song
            //////////unnessacary loop - too much data:Working///////////////
            // var artist = data.tracks.items[0]

            //     for(var i = 0; i< artist.length; i++){
            //         console.log(artist[i].artists[0].name)
            //     }

        }

    });



    // console.log(searchterm)

}


function dowhatitsays(searchterm, queryterm) {
    if (queryterm === "movie-this") {
        moviethis(searchterm)

    } else if (queryterm === "spotify-this-song") {
        spotifythis(searchterm)
    } else if (queryterm === "concert-this") {
        concertthis(searchterm)
    } else {
        console.log("Not Working")
    }
}

function logging() {
    fs.appendFile("Log.txt", ", " + queryterm, function (err) {
        if (err) {
            console.log("somethings wrong")
        } else {
            console.log("node cmd logged")
        }
    })
}
logging()

///Two things missing: 1. Formatted datetime into mm/dd/yyyy 2. proper url for concert-this bandsintownapi
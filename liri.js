var twitterKeys = require('./keys.js');
twitterKeys = twitterKeys.twitterKeys;

var fs = require('fs');
var spotify = require('spotify');
var Twitter = require('twitter');
var request = require('request');

var command = process.argv[2];

main(command);

function main(mode, q) {
	switch (mode) {
		case 'my-tweets':
			fs.appendFile('./log.txt', '\nmy-tweets:\n', 'utf8', (err) => {if (err) throw err;});
			getTweets();
			break;

		case 'spotify-this-song':
			fs.appendFile('./log.txt', '\nspotify-this-song:\n', 'utf8', (err) => {if (err) throw err;});
			getSongs(q);
			break;

		case 'movie-this':
			fs.appendFile('./log.txt', '\nmovie-this:\n', 'utf8', (err) => {if (err) throw err;});
			getMovie(q);
			break;

		case 'do-what-it-says':
			fs.appendFile('./log.txt', '\ndo-what-it-says:\n', 'utf8', (err) => {if (err) throw err;});
			getFile();
			break;
	}
}

function getTweets() {
	var client = new Twitter({
		consumer_key: twitterKeys.consumer_key,
		consumer_secret: twitterKeys.consumer_secret,
		access_token_key: twitterKeys.access_token_key,
		access_token_secret: twitterKeys.access_token_secret
	});

	var params = {
		screen_name: 'morgansliman',
		count: 20
	};

	client.get('statuses/user_timeline', params, (err, tweets, response) => {
		if (err) return err;

		for (var i = 0; i < tweets.length; i++) {
			var data = `Tweet ${i+1}:\n${tweets[i].text}\nCreated: ${tweets[i].created_at}\n`;
			console.log(data);
			fs.appendFile('./log.txt', data, 'utf8', (err) => {if (err) throw err;});
		}
	})
}

function getSongs(q) {
	if (q) {
		var song = q;
	}
	else if (!process.argv[3]) {
		var song = 'The Sign Ace of Base';
	}
	else {
		var song = process.argv[3];
	}

	if (process.argv.length > 4) {
		console.log('Song title must be in quotation marks.');
		return;
	}

	spotify.search({ type: 'track', query: song }, (err, data) => {
		if (err) return err;

		var result = data.tracks.items[1];
		var artist = result.artists[0].name;
		var name = result.name;
		var preview = result.preview_url;
		var album = result.album.name;
		
		var output = `\nSong: ${name}\nArtist: ${artist}\nAlbum: ${album}\nPreview: ${preview}\n`;
		console.log(output);
		fs.appendFile('./log.txt', output, 'utf8', (err) => {if (err) throw err;});
	});
}

function getMovie(q) {
	if (q) {
		var movie = q;
	}
	else if (!process.argv[3]) {
		var movie = 'Mr. Nobody';
	}
	else {
		var movie = process.argv[3];
	}

	if (process.argv.length > 4) {
		console.log('Movie title must be in quotation marks.');
		return;
	}

	var url = 'https://www.omdbapi.com/?type=movie&tomatoes=true&t=' + encodeURIComponent(movie);

	request(url, (err, response, body) => {
		if (!err && response.statusCode == 200) {

			body = JSON.parse(body);

			var title = body.Title,
				year = body.Year,
				imdb_rating = body.imdbRating,
				country = body.Country,
				language = body.Language,
				plot = body.Plot,
				actors = body.Actors,
				tomato_rating = body.tomatoRating,
				tomato_url = body.tomatoURL;

			var output = `\
			\nTitle: ${title}\nYear: ${year}\nIMDB Rating: ${imdb_rating}\
			\nCountry: ${country}\nLanguage: ${language}\nPlot: ${plot}\
			\nActors: ${actors}\nRotten Tomatoes Rating: ${tomato_rating}\
			\nRotten Tomatoes URL: ${tomato_url}\n`;

			console.log(output);
			fs.appendFile('./log.txt', output, 'utf8', (err) => {if (err) throw err;});
		}
	});
}

function getFile() {
	fs.readFile('./random.txt', 'utf8', (err, data) => {
		if (err) return err;

		data = data.trim();
		var command = data.split(',')[0],
			query = data.split(',')[1];

		main(command, query);
	});
}
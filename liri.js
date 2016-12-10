var twitterKeys = require('./keys.js');

var command = process.argv[2];

switch (command) {
	case 'my-tweets':
		getTweets();
		break;

	case 'spotify-this-song':
		getSongs();
		break;

	case 'movie-this':
		getMovie();
		break;

	case 'do-what-it-says':
		getFile();
		break;
}
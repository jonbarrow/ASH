const config = require('./config');
const ASH = new (require('./ash'))(config);

const playSongModule = require('./modules/play_song');
const personSearchModule = require('./modules/person_search');
const weatherQueryModule = require('./modules/weather');

ASH.registerModule('playsong', playSongModule);
ASH.registerModule('questions.whois', personSearchModule);
ASH.registerModule('questions.whowas', personSearchModule);
// Maybe split the weather query into different modules/functions for different outputs?
ASH.registerModule('weatherquery.forecast', weatherQueryModule);
ASH.registerModule('weatherquery.temperature', weatherQueryModule);

ASH.powerOn();
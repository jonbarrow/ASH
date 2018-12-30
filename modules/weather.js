const got = require('got');

const IP_API_BASE = 'https://api.ipify.org/?format=json';
const GEO_API_BASE = 'http://ip-api.com/json';
// Thanks Apple. This is from HTTP requests made by the iPhone
const FORCAST_API_BASE = 'https://api.weather.com/v1/geocode';
const FORCAST_API_KEY = 'e45ff1b7c7bda231216c7ab7c33509b8';
const FORCAST_API_PRODUCTS = [
	'conditionsshort',
	'fcstdaily10short',
	'fcsthourly24short',
	'nowlinks'
].join();
const HEADERS = {
	'Accept': '*/*',
	'Accept-Language': 'en-us',
	'Connection': 'keep-alive',
	'Accept-Encoding': 'br, gzip, deflate',
	'User-Agent': 'Weather_WeatherFoundation[1]_15G77'
};

module.exports = async () => {
	let response = await got(IP_API_BASE, {json: true });
	let data = response.body;

	response = await got(`${GEO_API_BASE}/${data.ip}`, {json: true });
	data = response.body;

	response = await got(`${FORCAST_API_BASE}/${data.lat}/${data.lon}/aggregate.json?apiKey=${FORCAST_API_KEY}&products=${FORCAST_API_PRODUCTS}`, {
		json: true,
		headers: HEADERS
	});
	data = response.body;

	console.log(`[ASH]> It is currently ${data.conditionsshort.observation.imperial.temp} degress outside`);
};
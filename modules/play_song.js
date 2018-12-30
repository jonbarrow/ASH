const ytsearch = require('youtube-search');
const ytdl = require('ytdl-core');
const ffmpegBinary = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
const lame = require('lame');
const Speaker = require('speaker');
ffmpeg.setFfmpegPath(ffmpegBinary.path);
const decoder = new lame.Decoder();

module.exports = (response, ASH) => {
	const message = response.utterance;
	if (!message.startsWith('play')) {
		// Should probably add more specific error handling here
		return ASH.error();
	}

	const songName = message.split(' ').slice(1).join(' '); // Grab everything after "play" and assume it's the title

	ytsearch(songName, {
		maxResults: 1,
		key: ASH.config.youtube_data_api_key
	}, (error, results) => {
		if (error) {
			return console.error(error);
		} else if (!results.lengthd <= 0) {
			// Should probably add more specific error handling here
			return ASH.error();
		}

		const songID = results[0].id;
		const dl = ytdl(`https://www.youtube.com/watch?v=${songID}`, {
			filter: 'audioonly'
		});

		ffmpeg(dl)
			.format('mp3')
			.pipe(decoder)
			.on('format', format => {
				const speaker = new Speaker(format);
				decoder.pipe(speaker);

				speaker.on('close', () => {
					console.log('done');
				});
			});
	});
};
const nlp = require('compromise'); // NLP lib, being used for entity extraction
const wtfw = require('wtf_wikipedia'); // Parsing data from Wikipedia

module.exports = (response, ASH) => {
	const message = response.utterance;
	const entities = nlp(message).topics().data(); // Grab the entities/entity

	if (!entities || !entities[0] || !entities[0].text) { // Quit if compromise failed
		return ASH.error();
	}

	const entity = entities[0].text; // This is what will be searched for

	// Grab the data from Wikipedia
	wtfw.fetch(entity).then(doc => {
		// Just grab the first sentence and spit it out who cares
		console.log('[ASH]>', doc.sentences(0).text());
		ASH.io.prompt();
	}).catch(() => {
		ASH.error();
	});
};
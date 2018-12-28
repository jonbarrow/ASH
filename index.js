const readline = require('readline'); // For IO
const nlp = require('compromise'); // NLP lib, being used for entity extraction
const { NlpManager } = require('node-nlp'); // NLP lib, being used to determine intent of messages
const wtfw = require('wtf_wikipedia'); // Parsing data from Wikipedia
const config = require('./config');

// Setup the language manager and load in the already trained data
const manager = new NlpManager(config.manager);
manager.load(config.model_path);

// Setup the IO
const io = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

io.setPrompt('Talk to ASH> ');
io.prompt();

// Handle messages
io.on('line', text => {
	// Process the text
	manager.process(config.language, text)
		.then(response => {
			const intent = response.intent; // Grab the intent
			
			// Handle based on intent
			switch (intent) {
				case 'questions.whois':
				case 'questions.whowas':
				case 'questions.whatis':  // These two basically never work cuz compromise has trouble picking the topic out
				case 'questions.whatwas': // These two basically never work cuz compromise has trouble picking the topic out
					const entities = nlp(response.utterance).topics().data(); // Grab the entities/entity

					if (!entities || !entities[0] || !entities[0].text) { // Quit if compromise failed
						messageHandleError();
						return;
					}

					const entity = entities[0].text; // This is what will be searched for

					// Grab the data from Wikipedia
					wtfw.fetch(entity).then(doc => {
						// Just grab the first sentence and spit it out who cares
						console.log('[ASH]>', doc.sentences(0).text());
						io.prompt();
					}).catch(() => {
						messageHandleError();
					});

					break;
				default:
					messageHandleError();
					break;
			}
		});
});

// Generic error handle
function messageHandleError() {
	console.log('[ASH]>', 'Unable to process response');
	io.prompt();
}
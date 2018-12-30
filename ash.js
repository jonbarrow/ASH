const { NlpManager } = require('node-nlp'); // NLP lib, being used to determine intent of messages
const say = require('say'); // TTS
const Brain = require('./brain'); // This currently does nothing. Maybe things like language processing should be moved here?

class ASH {
	constructor(config) {
		this.handlers = [];
		this.config = config;
		this.brain = new Brain(); // Does nothing
		this.voice = say;
		this.nlpManager;

		const readline = require('readline'); // For IO 
		this.io = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});
		
		this.io.setPrompt('Talk to ASH> ');
		this.io.prompt();
	}

	registerModule(name, handler) {
		this.handlers.push({
			name,
			handler
		});
	}

	powerOn() {
		// Start program. This should be replaced with a real startup script
		// Maybe eventually bring in something like Sonus for hotword detection and voice commands?
		this.nlpManager = new NlpManager(this.config.nlpManager);
		this.nlpManager.load(this.config.model_path);

		this.io.on('line', text => {
			this.nlpManager.process(this.config.language, text).then(this.handleMessage.bind(this)); 
		});
	}

	handleMessage(response) {
		if (response.intent === 'None') {
			return this.error();
		}

		const intent = response.intent;
		const handlers = this.handlers.filter(object => object.name === intent);

		for (const handler of handlers) {
			handler.handler(response, this);
		}
	}

	error() {
		// Should maybe add real error handling
		console.log('[ASH]> Could not process message');
		this.io.prompt();
	}
}

module.exports = ASH;
const { NlpManager } = require('node-nlp');
const config = require('../config');
const trainingData = require('./data');

const manager = new NlpManager(config.manager);

for (const data of trainingData) {
	manager.addDocument(data.locale, data.sample, data.intent);
}

(async () => {
	await manager.train();
	manager.save(`${__dirname}/model.nlp`);
})();
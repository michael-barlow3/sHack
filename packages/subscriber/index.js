const subscriber = require("./subscriber.js");

(async function () {
	console.log("Initialize Subscriber service");
	const clientReady = await subscriber.init();
	if (clientReady) {
		subscriber.runAndWait();
	}
})();

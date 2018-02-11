var request = require("request");
var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
	// Process socket notification from MMM-CTA.js

	start: function() {
		// this.started = false;
		this.config = null;
	},

	socketNotificationReceived: function(notification, payload) { // Payload is 'request' from MMM-CTA
		var self = this;
		/* if (notification === 'CTA-REQUEST' && self.started == false) {
			// console.log("Running CTA-REQUEST"); for debugging			
			self.sendSocketNotification("STARTED", true);
			self.config = payload;
			self.getData(payload);
			self.started = true;
			} else if (notification === 'CTA-REQUEST' && self.started == true) {
				self.config = payload;
			self.getData(payload)
			} */
		if (notification === 'CTA-REQUEST' ) {
			// console.log("Running CTA-REQUEST"); // for debugging			
			self.config = payload;
			self.getData(payload);
			}
	},

	getData: function(payload) {
		var self = this;
		var bodyJs = {
			bus: null,
			train: null
			};
		// console.log("Getting data from CTA"); // for debugging
		var myUrlBus = payload.urlBus + "?key=" + payload.key + "&stpid=" + payload.stpid + "&format=json";
		var myUrlTrain = payload.urlTrain + "?key=" + payload.keyTrain + "&max=5" + "&mapid=" + payload.idTrain + "&outputType=json";
		// console.log(myUrl); // for debugging
		request({url: myUrlBus}, function (error, response, body) {
			console.log("CTA request fired."); // for debugging
			// Following line for building, delete when able to get DOM to show
			// self.sendSocketNotification("MMM-CTA-DATA", "TESTING");
			// Delete above when solved
			if (!error && response.statusCode == 200) {
				bodyJs.bus = JSON.parse(body);
				// console.log(bodyJs); // For testing purposes;
			}; // else {console.log("error getting data: " + error + "Body: " + body)};
		request({url: myUrlTrain}, function (error, response, body) {
			console.log("CTA request fired train."); // for debugging
			// Following line for building, delete when able to get DOM to show
			// self.sendSocketNotification("MMM-CTA-DATA", "TESTING");
			// Delete above when solved
			if (!error && response.statusCode == 200) {
				bodyJs.train = JSON.parse(body);
				// console.log(bodyJs); // For testing purposes;
				self.sendSocketNotification("MMM-CTA-DATA", bodyJs)	
		});
		// console.log(payload.updateInterval); Testing to see update interval
		// handled by scheduleUpdate function setInterval(function() { self.getData(payload); }, payload.updateInterval);
	}

});

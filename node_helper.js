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
		// console.log("Getting data from CTA"); // for debugging
		var myUrl = payload.url + "?key=" + payload.key + "&stpid=" + payload.stpid + "&format=json";
		// console.log(myUrl); // for debugging
		request({url: myUrl}, function (error, response, body) {
			console.log("CTA request fired."); // for debugging
			// Following line for building, delete when able to get DOM to show
			self.sendSocketNotification("MMM-CTA-DATA", "TESTING");
			// Delete above when solved
			if (!error && response.statusCode == 200) {
				var bodyJs = JSON.parse(body);
				// console.log(bodyJs); // For testing purposes;
				self.sendSocketNotification("MMM-CTA-DATA", bodyJs)
			}; // else {console.log("error getting data: " + error + "Body: " + body)};
		});
		// console.log(payload.updateInterval); Testing to see update interval
		// handled by scheduleUpdate function setInterval(function() { self.getData(payload); }, payload.updateInterval);
	}

});

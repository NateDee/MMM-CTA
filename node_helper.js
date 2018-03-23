var request = require("request");
var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
	// Process socket notification from MMM-CTA.js

	start: function() {
		this.config = null;
	},

	socketNotificationReceived: function(notification, payload) { // Payload is 'request' from MMM-CTA
		var self = this;
		if (notification === "CTA-REQUEST" ) {
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
			// console.log("CTA request fired."); // for debugging
			// Following line for building, delete when able to get DOM to show
			// self.sendSocketNotification("MMM-CTA-DATA", "TESTING");
			// Delete above when solved
			if (!error && response.statusCode == 200) {
				bodyJs.bus = JSON.parse(body);
				console.log(bodyJs.bus); // For testing purposes;
				request({url: myUrlTrain}, function (error, response, body) {
					console.log("CTA request fired train."); // for debugging
					// Following line for building, delete when able to get DOM to show
					// self.sendSocketNotification("MMM-CTA-DATA", "TESTING");
					// Delete above when solved
						if (!error && response.statusCode == 200) {
						bodyJs.train = JSON.parse(body);
						console.log(bodyJs.train); // For testing purposes;
						self.sendSocketNotification("MMM-CTA-DATA", bodyJs)
						} else { // Still send bus data if train fails...
							self.sendSocketNotification("MMM-CTA-DATA", bodyJs)
						}
					});
			} else {
				// If no data from bus or error from bus still run train!
				request({url: myUrlTrain}, function (error, response, body) {
					console.log("CTA request fired train."); // for debugging
					// If no error, store in bodyJs
						if (!error && response.statusCode == 200) {
						bodyJs.train = JSON.parse(body);
						console.log(bodyJs.train); // For testing purposes;
						self.sendSocketNotification("MMM-CTA-DATA", bodyJs)
							};
					});
				}
		});
	}

});

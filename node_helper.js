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
		
		// Had an issue with these requests firing and socket sending without Bus data, so nested train into bus run
		//  The issue with this is, if bus gets an error I won't get any data at all, FIND A BETTER FIX
		request({url: myUrlBus}, function (error, response, body) {
			// console.log("CTA request fired."); // for debugging
			// If no error, store in bodyJs, then run train request
			if (!error && response.statusCode == 200) {
				bodyJs.bus = JSON.parse(body);
				console.log(bodyJs.bus); // For testing purposes;
				request({url: myUrlTrain}, function (error, response, body) {
					console.log("CTA request fired train."); // for debugging
					// If no error, store in bodyJs
						if (!error && response.statusCode == 200) {
						bodyJs.train = JSON.parse(body);
						console.log(bodyJs.train); // For testing purposes;
						self.sendSocketNotification("MMM-CTA-DATA", bodyJs)};	
			});
			}; // else {console.log("error getting data: " + error + "Body: " + body)};
		});
	}

});

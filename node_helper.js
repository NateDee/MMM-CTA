var request = require("request");
var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
	// Process socket notification from MMM-CTA.js

	start: function() {
		this.config = null;
		this.instance = null;
	},

	getData: function(payload) {
		var self = this;
		var busReady = false;
		var trainReady = false;
		this.instance = "MMM-CTA-DATA" + payload.modInstance;
		// Set myUrlBus based on what is set, first, if "top" is set, then if not set
		if (payload.urlBus !== null && payload.key !== null && payload.stpid !== null && payload.maxRes !== null) {
			var myUrlBus = payload.urlBus + "?key=" + payload.key + "&stpid=" + payload.stpid + "&top=" + payload.maxRes +  "&format=json";
			busReady = true;
		} else if (payload.urlBus !== null && payload.key !== null && payload.stpid !== null) {
			var myUrlBus = payload.urlBus + "?key=" + payload.key + "&stpid=" + payload.stpid + "&format=json";
			busReady = true;
		} else { console.log("MMM-CTA: Bus config incomplete!!!"); };
		
		if (payload.urlTrain !== null && payload.keyTrain !== null && payload.maxResTrain !== null && payload.idTrain !== null) {
			var myUrlTrain = payload.urlTrain + "?key=" + payload.keyTrain + "&max="+ payload.maxResTrain + "&mapid=" + payload.idTrain + "&outputType=json";
			trainReady = true;
		} else if (payload.urlTrain !== null && payload.keyTrain !== null && payload.idTrain !== null) { // Max result will be 4 by default
			var myUrlTrain = payload.urlTrain + "?key=" + payload.keyTrain + "&max=5" + "&mapid=" + payload.idTrain + "&outputType=json";
			trainReady = true;
		} else { console.log("MMM-CTA: Train config incomplete!!!"); };

		// Functions for bus & train, bus, or train only
		if (busReady && trainReady) {
			self.getBusTrain(myUrlBus, myUrlTrain);
		} else if (busReady) {
			self.getBus(myUrlBus);
		} else if (trainReady) {
			self.getTrain(myUrlTrain);
		} else { 
			console.log("No complete bus or train configs found!!!"); 
		};
	},	
	
	// console.log(myUrl); // for debugging
	getBusTrain: function(myUrlBus, myUrlTrain) {
		var self = this;
		console.log(self.instance);
		var bodyJs = {
			bus: null,
			train: null
		};
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
						self.sendSocketNotification(self.instance, bodyJs)
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
					self.sendSocketNotification(self.instance, bodyJs)
					};
				});
			}
		});
	},

	getBus: function(myUrlBus) {
		var self = this;
		var bodyJs = {
			bus: null,
			train: null
		};
		request({url: myUrlBus}, function (error, response, body) {
			// console.log("CTA request fired."); // for debugging
			// Following line for building, delete when able to get DOM to show
			// self.sendSocketNotification("MMM-CTA-DATA", "TESTING");
			// Delete above when solved
			if (!error && response.statusCode == 200) {
				bodyJs.bus = JSON.parse(body);
				self.sendSocketNotification(self.instance, bodyJs);
				console.log(bodyJs);
			};
		});
	},

	getTrain: function(myUrlTrain) {
		var self = this;
		var bodyJs = {
			bus: null,
			train: null
		};
		request({url: myUrlTrain}, function (error, response, body) {
			console.log("CTA request fired train."); // for debugging
			// If no error, store in bodyJs
			if (!error && response.statusCode == 200) {
				bodyJs.train = JSON.parse(body);
				console.log(bodyJs.train); // For testing purposes;
				self.sendSocketNotification(self.instance, bodyJs)
			};
		});
	},

	socketNotificationReceived: function(notification, payload) { // Payload is 'request' from MMM-CTA
		var self = this;
		if (notification === "CTA-REQUEST" ) {
			// console.log("Running CTA-REQUEST"); // for debugging			
			self.config = payload;
			self.getData(payload);
			}
	}

});

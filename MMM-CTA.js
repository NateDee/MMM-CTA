Module.register("MMM-CTA", {
	defaults: { // Start with the information needed for a single stop
		stopName: null,
		stationId: null,
		stopId: null,
		maxResult: null,
		routeCode: null,
		ctaApiKey: null,
		updateTime: 60000, // 1 minute
		busUrl: 'www.ctabustracker.com/bustime/api/v2/getpredictions', // deleted http:
		initialLoadDelay: 0, // start delay seconds.
	},

	// requireVersion: 

	getStyles: function() {
		return ["font-awesome.css"];
	},

/*	loader: function() {
		var loader = document.createElement("div");
		loader.innerHTML = ("LOADING CTA TRACKER");
		loader.className = "small dimmed";
		return loader;
		this.loaded = false;
		Log.log("Loader run.")
	},
*/
	header: function() {
		var header = document.createElement("header");
		header.innerHTML = this.config.stopName;
		return header;
	},

	start: function() {
		Log.info("Starting module: " + this.name);
		// Prevent API abuse, bus tracker limits 10,000/day
		if (this.updateTime < 60000) {
			this.updateTime = 60000 // Every 15 sec (overkill as they don't update API that often);
		};
		this.loaded = false;
		this.scheduleUpdate(this.config.initialLoadDelay);
		this.updateTimer = null;
		this.apiRequest(this);
	},

	apiRequest: function(self) {
		// Variables needed for API request, see CTA devel documentation
		var request = {
			mapid: self.config.stationId,
			stpid: self.config.stopId,
			maxRes: self.config.maxResult,
			rt: self.config.routeCode,
			key: self.config.ctaApiKey,
			url: self.config.busUrl,
			updateInterval: self.config.updateTime

		};
		// Log.log("Request: " + JSON.stringify(request));
		self.sendSocketNotification("CTA-REQUEST", request)  // Socket notification processed in node_helper.js;
	},

	// Probably should remove this, because I run an initialization with start module..
	/* notificationReceived: function(notification, payload, sender) {
		if (notification === "DOM_OBJECTS_CREATED") {
			Log.log(this.name + " received a sys notification: " + notification);
			this.apiRequest(this);
			console.log("Start CTA dom");
		}
	}, */

	getDom: function() {
		console.log("Updating CTA dom"); // testing, make sure updateDom is running
		var self = this;
		// Create document container
		wrapper = document.createElement("div");
		// create table
		var table = document.createElement("table");

		if (this.dataNotification) {
			var headRow = document.createElement("tr");
			var headElement = document.createElement("td");
			headElement.className = "medium";
			headElement.colSpan = "3";
			headElement.innerHTML = "Incidents";
			headRow.appendChild(headElement);
			table.appendChild(headRow);
			
			// Nest this to an if statements with incidents, for now just testing output
			var iRow = document.createElement("tr");
			var iElement = document.createElement("td");
			iElement.align = "small";
			iElement.colSpan = "3";
			iElement.className = "xsmall";
			iElement.innerHTML = "No Incidents Reported";
			iRow.appendChild(iElement);
			table.appendChild(iRow);
			
			// Stop name header... create loop with bus row following later...
			var stopRow = document.createElement("tr");
			var stopRowElement = document.createElement("td");
			stopRowElement.align ="middle";
			stopRowElement.colSpan = "3";
			stopRowElement.className = "medium";
			stopRowElement.innerHTML = this.config.stopName;
			stopRow.appendChild(stopRowElement);
			table.appendChild(stopRow);

			// Do the bus title row
			var busRow = document.createElement("tr");
			busRow.className = "small";
			busRow.align = "left";
			var dirElement = document.createElement("td");
			dirElement.innerHTML = "Direction";// dataNotification["bustime-response"].prd[0].rtdir;
			busRow.appendChild(dirElement);
			var rtElement = document.createElement("td");
			rtElement.align = "left";
			rtElement.innerHTML = "Route #"; // dataNotification["bustime-response"].prd[0].rt;
			busRow.appendChild(rtElement);
			var arrivalElement = document.createElement("td");
			arrivalElement.align = "right";
			arrivalElement.innerHTML = "Arrival" // dataNotification["bustime-response"].prd[0].rt;
			busRow.appendChild(arrivalElement);
			// Append busRow into table!
			table.appendChild(busRow);
			
				// Do the bus content row with a loop
			for (i = 0, len = this.dataNotification["bustime-response"].prd.length; i < len; i++) {
				var arriveRow = document.createElement("tr");
				arriveRow.className = "small";
				arriveRow.align = "left";
				var arriveElement = document.createElement("td");
				arriveElement.innerHTML = this.dataNotification["bustime-response"].prd[i].rtdir;
				arriveRow.appendChild(arriveElement);
				var rtArriveElement = document.createElement("td");
				rtArriveElement.align = "left";
				rtArriveElement.innerHTML = this.dataNotification["bustime-response"].prd[i].rt + " " + "<i class='fa fa-bus' aria-hidden='true'></i>";
				arriveRow.appendChild(rtArriveElement);
				var arrivalArriveElement = document.createElement("td");
				arrivalArriveElement.align = "right";
				arrivalArriveElement.innerHTML = this.dataNotification["bustime-response"].prd[i].prdctdn + " min";
				arriveRow.appendChild(arrivalArriveElement);
				// Append busArrivalRow into table!
				table.appendChild(arriveRow);
			}

		}
		wrapper.appendChild(table);
		return wrapper;
	},

    	/* scheduleUpdate()
     	* Schedule next update.
     	* argument delay number - Milliseconds before next update. If empty, this.config.updateInterval is used.
     	* see:  https://github.com/nwootton/MMM-UKLiveBusStopInfo */
    	scheduleUpdate: function(delay) {
        	var nextLoad = this.config.updateTime;
        	if (typeof delay !== "undefined" && delay >= 0) {
            		nextLoad = delay;
       		}

        	var self = this;
        	clearTimeout(this.updateTimer);
        	this.updateTimer = setTimeout(function() {
			self.apiRequest(self);
		}, nextLoad);
    },

	socketNotificationReceived: function (notification, payload) {
		if (notification === "MMM-CTA-DATA") {
			// send payload (aka bus data to new var = dataNotification)
			console.log("Payload received"); // debugging			
			this.dataNotification = payload;
			this.updateDom();
			this.scheduleUpdate(this.config.updateTime);
		}
	},


});

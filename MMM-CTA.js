Module.register("MMM-CTA", {
	defaults: { // Start with the information needed for a single stop
		busStopName: null,
		// stationId: null,
		stopId: null,
		maxResult: null,
		maxResultTrain: null,
		routeCode: null,
		ctaApiKey: null,
		updateTime: 60000, // 1 minute
		busUrl: 'http://www.ctabustracker.com/bustime/api/v2/getpredictions', // deleted http:
		// initialLoadDelay: 0, // This is obsolete, loaded first call by start()
		trainUrl: 'http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx',
		ctaApiKeyTrain: null,
		trainStationID: null,
		trainStopName: null,
		moduleInstance: 1,
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
		header.innerHTML = this.config.busStopName;
		return header;
	},

	start: function() {
		Log.info("Starting module: " + this.name);
		// Prevent API abuse, bus tracker limits 10,000/day
		if (this.updateTime < 60000) {
			this.updateTime = 60000 // Every 15 sec (overkill as they don't update API that often);
		};
		this.loaded = false;
		this.instanceData = "MMM-CTA-DATA" + this.config.moduleInstance;
		// this.instanceReq = "CTA-REQUEST" + this.config.moduleInstance;
		// Initial run to start;
		if (this.config.moduleInstance === 1) {
			this.apiRequest(this);
			this.scheduleUpdate();
		} else if (this.config.moduleInstance > 1) {
			setTimeout(this.apiRequest, 4000 * this.config.moduleInstance, this);
			setTimeout(this.scheduleUpdate, 4000 * this.config.moduleInstance);
		};
	
	},

	apiRequest: function(self) {
		// Variables needed for API request, see CTA devel documentation
		var request = {
			// mapid: self.config.stationId,
			stpid: self.config.stopId,
			maxRes: self.config.maxResult,
			maxResTrain: self.config.maxResultTrain,
			rt: self.config.routeCode,
			key: self.config.ctaApiKey,
			urlBus: self.config.busUrl,
			updateInterval: self.config.updateTime,
			urlTrain: self.config.trainUrl,
			keyTrain: self.config.ctaApiKeyTrain,
			idTrain: self.config.trainStationID,
			modInstance: self.config.moduleInstance
		};
		self.sendSocketNotification("CTA-REQUEST", request);  // Socket notification processed in node_helper.js;
	},

	getDom: function() {
		// console.log("Updating CTA dom"); // testing, make sure updateDom is running
		var self = this;
		// Create document container
		wrapper = document.createElement("div");
		// create table
		var table = document.createElement("table");

		if (this.dataNotification) {
			
			// Stop name header... create loop with bus row following later...
			// Check if bus is not null, if has data, run update:
			if (this.dataNotification.bus !== null) {
				var stopRow = document.createElement("tr");
				var stopRowElement = document.createElement("td");
				stopRowElement.align ="middle";
				stopRowElement.colSpan = "3";
				stopRowElement.className = "small";
				stopRowElement.innerHTML = this.config.busStopName;
				stopRow.appendChild(stopRowElement);
				table.appendChild(stopRow);

				// Do the bus title row
				var busRow = document.createElement("tr");
				busRow.className = "xsmall";
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
				for (i = 0, len = this.dataNotification.bus["bustime-response"].prd.length; i < len; i++) {
					var arriveRow = document.createElement("tr");
					arriveRow.className = "xsmall";
					arriveRow.align = "left";
					var arriveElement = document.createElement("td");
					arriveElement.innerHTML = this.dataNotification.bus["bustime-response"].prd[i].rtdir;
					arriveRow.appendChild(arriveElement);
					var rtArriveElement = document.createElement("td");
					rtArriveElement.align = "left";
					rtArriveElement.innerHTML = this.dataNotification.bus["bustime-response"].prd[i].rt + " " + "<i class='fa fa-bus' aria-hidden='true'></i>";
					arriveRow.appendChild(rtArriveElement);
					var arrivalArriveElement = document.createElement("td");
					arrivalArriveElement.align = "right";
					arrivalArriveElement.innerHTML = this.dataNotification.bus["bustime-response"].prd[i].prdctdn + " min";
					arriveRow.appendChild(arrivalArriveElement);
					// Append busArrivalRow into table!
					table.appendChild(arriveRow);
				}
			};
			if (this.dataNotification.train !== null) {
				var stopRow = document.createElement("tr");
				var stopRowElement = document.createElement("td");
				stopRowElement.align ="middle";
				stopRowElement.colSpan = "3";
				stopRowElement.className = "small";
				stopRowElement.innerHTML = this.config.trainStopName;
				stopRow.appendChild(stopRowElement);
				table.appendChild(stopRow);

				// Do the bus title row
				var busRow = document.createElement("tr");
				busRow.className = "xsmall";
				busRow.align = "left";
				var dirElement = document.createElement("td");
				dirElement.innerHTML = "Direction"; // dataNotification["ctatt"].prd[0].rtdir;
				busRow.appendChild(dirElement);
				var rtElement = document.createElement("td");
				rtElement.align = "left";
				rtElement.innerHTML = "Route #"; // dataNotification["ctatt"].prd[0].rt;
				busRow.appendChild(rtElement);
				var arrivalElement = document.createElement("td");
				arrivalElement.align = "right";
				arrivalElement.innerHTML = "Arrival" // dataNotification["ctatt"].prd[0].rt;
				busRow.appendChild(arrivalElement);
				// Append busRow into table!
				table.appendChild(busRow);
			
				// Do the train content row with a loop
				for (i = 0, len = this.dataNotification.train["ctatt"].eta.length; i < len; i++) {
					var arriveRow = document.createElement("tr");
					arriveRow.className = "xsmall";
					arriveRow.align = "left";
					var arriveElement = document.createElement("td");
					arriveElement.innerHTML = this.dataNotification.train["ctatt"].eta[i].destNm;
					arriveRow.appendChild(arriveElement);
					var rtArriveElement = document.createElement("td");
					rtArriveElement.align = "left";
					rtArriveElement.innerHTML = "<i class='fa fa-subway' style='color:blue'></i>"; // Add options for other train colors
					arriveRow.appendChild(rtArriveElement);
					var arrivalArriveElement = document.createElement("td");
					arrivalArriveElement.align = "right";
					var arrivalT = moment(this.dataNotification.train["ctatt"].eta[i].arrT);
					var now = moment();
					var duration = moment.duration(arrivalT.diff(now));
					var arrivalTime = Math.round(duration.asMinutes());
					arrivalArriveElement.innerHTML = arrivalTime + " min";
					arriveRow.appendChild(arrivalArriveElement);
					// Append busArrivalRow into table!
					table.appendChild(arriveRow);
				}
			}
		};
		wrapper.appendChild(table);
		return wrapper;
	},

    	/* scheduleUpdate()
     	* Schedule next update.
     	* this.config.updateInterval is used.
     	* see:  https://github.com/nwootton/MMM-UKLiveBusStopInfo */
    	scheduleUpdate: function() {
        	var nextLoad = this.config.updateTime;
        	var self = this;
        	this.updateTimer = setInterval(function() {
			self.apiRequest(self);
		}, nextLoad);
    },

	socketNotificationReceived: function (notification, payload) {
		if (notification === this.instanceData) {
			// send payload (aka bus/train data to new var = dataNotification)
			console.log("Payload received");			
			this.dataNotification = payload;
			this.updateDom();
			// this.scheduleUpdate(this.config.updateTime); NO LONGER NEED SINCE USING setInterval()
		}
	},
});

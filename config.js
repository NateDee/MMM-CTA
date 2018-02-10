/* Magic Mirror Config Sample
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 *
 * For more information how you can configurate this file
 * See https://github.com/MichMich/MagicMirror#configuration
 *
 */

var config = {
	address: "localhost", // Address to listen on, can be:
	                      // - "localhost", "127.0.0.1", "::1" to listen on loopback interface
	                      // - another specific IPv4/6 to listen on a specific interface
	                      // - "", "0.0.0.0", "::" to listen on any interface
	                      // Default, when address config is left out, is "localhost"
	port: 8080,
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"], // Set [] to allow all IP addresses
	                                                       // or add a specific IPv4 of 192.168.1.5 :
	                                                       // ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
	                                                       // or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
	                                                       // ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

	language: "en",
	timeFormat: 12,
	units: "imperial",

	modules: [
		{
			module: "alert",
		},
		{
			module: "updatenotification",
			position: "top_bar"
		},
		{
			module: "clock",
			position: "top_left"
		},
		{
			module: "calendar",
			header: "My Calendar",
			position: "top_left",
			config: {
				calendars: [
					{
						symbol: "calendar",
						maximumEntries: 5,
						url: "https://calendar.google.com/calendar/ical/nate.damaschke%40gmail.com/private-543bac710acf7b958c82b1d0a715cbbc/basic.ics",
					},
					{
						symbol: "calendar",
						maximumEntries: 3,
						url: "https://calendar.google.com/calendar/ical/en.usa%23holiday%40group.v.calendar.google.com/public/basic.ics",
					},

				]
			}
		},
		{
			module: "compliments",
			position: "bottom_bar",
			config: {
				updateInterval: 120000
			}
		},
/*		{
			module: "currentweather",
			position: "top_right",
			config: {
				units = "imperial",
				initialLoadDelay: 1000,
				location: "Chicago",
				locationID: "4887398",  //ID from http://www.openweathermap.org/help/city_list.txt
				appid: "182b84d55fe01275bde01f735ccd8b94"
			}
		},
		{
			module: "weatherforecast",
			position: "top_right",
			header: "Weather Forecast",
			config: {
				location: "Chicago",
				locationID: "4887398",  //ID from http://www.openweathermap.org/help/city_list.txt
				appid: "182b84d55fe01275bde01f735ccd8b94"
			}
		}, */
		
		{
			module: 'MMM-MyWeather',
			position: 'bottom_right',
			config: {
				apikey: '16f618a660e03f02', // private; don't share!
				pws: 'pws:KILCHICA206', //culemborg
				hourly: '0',
				fctext: '1',
				fcdaycount: "4",
				fcdaystart: "0",
				hourlyinterval: "3",
				hourlycount: "2",
				alerttime: 10000,
				alerttruncatestring: "english:",
				roundTmpDecs: 1,
				UseCardinals: 0,
				layout: "horizontal",
				sysstat: 0,
				coloricon: true
			}
		},
		{
			module: "newsfeed",
			position: "bottom_bar",
			config: {
				feeds: [
					{
						title: "New York Times",
						url: "http://www.nytimes.com/services/xml/rss/nyt/HomePage.xml"
					}
				],
				showSourceTitle: true,
				showPublishDate: true,
				updateInterval: 20000
			}
		},
		/* {
			module: "MMM-fitbit",
			position: "top_center",
			config: {
			credentials: {
				client_id: "22CPHW",
				client_secret: "c7e5b9e437c3cc1b54572d252c306c33",
				},
		resources: [
			'steps',
			'floors',
			'caloriesOut',
			'distance',
			'activeMinutes'
			],
		update_interval: 60
		}
		},
		{
			module: "MMM-fitbit2",
			position: "top_center",
			config: {
			credentials: {
				client_id: "22CPHT",
				client_secret: "569eb3a2b7e81c765e751226b7d3195b",
				},
		resources: [
			'steps',
			'floors',
			'caloriesOut',
			'distance',
			'activeMinutes'
			],
		update_interval: 60
		}
		}, */

		{
			module: "MMM-CTA",
			position: "bottom_left",
			config: {
					stopName: "Ashland and Blackhawk",
					stationId: null,
					stopId: 14619,
					maxResult: 5,
					routeCode: 66,
					ctaApiKey: 'fnuXHgKBkVcQmbAYXT9bWvCWF', //My api key: 'fnuXHgKBkVcQmbAYXT9bWvCWF',
					busUrl: 'http://www.ctabustracker.com/bustime/api/v2/getpredictions',
					updateTime: 60000
			}
		},
		{
		module: "MMM-MyScoreboard",
  		position: "top_right",
  		classes: "default everyone",
  		header: "My Scoreboard",
  		config: {
    			showLeagueSeparators: true,
    			colored: true,
    			viewStyle: "smallLogos",
			showRankings: true,
    			sports: [
      				{
        			league: "NCAAM",
        			groups: ["Big Ten"]
      				}]
			}
		}
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}

// File: safe-maps.js
// Description: Javascript file controlling functionality of Safe Maps Application for
// CS106S Workshop.
// Last Updated: Winter '17

/**************		Global Variables		****************/
var directionDisplay;
var directionsService = new google.maps.DirectionsService();
var map;					// Reference to Google Map object
var origin = null;			// Starting point
var destination = null;		// Ending point
var waypoints = [];			// Mid-way stops
var markers = [];			// Contains markers for all points on trip (origin, destination, and waypoints)
var crimes = JSON.parse(crimes);		// crime data from crimes.json
var crimeHeatMapData;					// global variable for heat map data
var relavantCrimeDist = 0.0008;

/*	Function: getHeatMapData()
 *	Iterates through crimes.json file and creates array of long, latitude points.
 */
function getHeatMapData() {
	var heatMapData = [];
	for (var i = 0; i < crimes.length; i++) {
		heatMapData.push(new google.maps.LatLng(crimes[i].lat, crimes[i].lng));
	}
	return heatMapData;
}

/*	Function: initializeGoogleMap()
 *	Initializes Google Map by filling div with ID "map_canvas" with a map of SF
 */
function initializeGoogleMap() {
	var sanfran = new google.maps.LatLng(37.7749295, -122.4194155);
	var myOptions = {
		zoom: 13,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		center: sanfran
	}
	return new google.maps.Map(document.getElementById("map_canvas"), myOptions);
}

/*	Function: initializeHeatMap()
 *	Plots a heat map layer on top of the map to show which areas have high concentrations of assault.
 *	For visual purposes only - not required for assignment.
 */
function initializeHeatMap() {
	var heatmap = new google.maps.visualization.HeatmapLayer({
		data: crimeHeatMapData,
		dissipating: false,
		radius: 0.005,
		opacity: 0.4
	});
	heatmap.setMap(map);
	var gradient = ['rgba(0, 255, 255, 0)','rgba(0, 255, 255, 1)','rgba(0, 191, 255, 1)','rgba(0, 127, 255, 1)', 'rgba(0, 63, 255, 1)', 'rgba(0, 0, 255, 1)', 'rgba(0, 0, 223, 1)', 'rgba(0, 0, 191, 1)', 'rgba(0, 0, 159, 1)', 'rgba(0, 0, 127, 1)', 'rgba(63, 0, 91, 1)', 'rgba(127, 0, 63, 1)', 'rgba(191, 0, 31, 1)', 'rgba(255, 0, 0, 1)'];
	heatmap.set('gradient', gradient);
}

/*	Function: plotCrimeMarkers()
 *	Plots a Google Maps Marker for each crime in our crimes.json. For debugging purposes only - will lead to a very
 *	cluttered map if called.
 */
function plotCrimeMarkers() {
	for (var i = 0; i < crimes.length; i++) {
		var marker = new google.maps.Marker({
	      position: {lat:crimes[i].lat, lng:crimes[i].lng},
	      map: map,
	      title: 'lat:' + crimes[i].lat + " long: " + crimes[i].lng
	    });
	}
}

/************** 1. Initialization ****************/
/*	Function: initialize()
 *	Called upon website loading. This creates everything that the user sees.
 */
function initialize() {
	// initialization of display, data, and map
	directionsDisplay = new google.maps.DirectionsRenderer();
	crimeHeatMapData = getHeatMapData();
	map = initializeGoogleMap();
	directionsDisplay.setMap(map);
	directionsDisplay.setPanel(document.getElementById("directionsPanel"));

	// Add "click" event listener to map so that when user clicks on map, a marker is added
	google.maps.event.addListener(map, 'click', function(event) {
		if (origin == null) {
			origin = event.latLng;
			addMarker(origin);
		} else if (destination == null) {
			destination = event.latLng;
			addMarker(destination);
		} else {
			// Max of 8 waypoints so that we don't go too crazy with the directions
			if (waypoints.length < 9) {
				waypoints.push({ location: destination, stopover: true });
				destination = event.latLng;
				addMarker(destination);
			} else {
				alert("Maximum number of waypoints reached");
			}
		}
	});

	// Initialization of helper visualizations (crime heatmap, crime markers)
	initializeHeatMap();
	//plotCrimeMarkers();
}


/************** 	2. UX	 ****************/
// These helper functions are used to aid in the use of the app.

/*	Function: addMarker(latlng)
 *	Adds a waypoint to a route.
 *	DO NOT EDIT
 */
function addMarker(latlng) {
	markers.push(new google.maps.Marker({
		position: latlng, 
		map: map,
		icon: "http://maps.google.com/mapfiles/marker" + String.fromCharCode(markers.length + 65) + ".png"
	}));    
}

/*	Function: clearMarkers()
 *	Helper function for setting all markers to null so that we don't double-plot markers on the map.
 *	DO NOT EDIT
 */
function clearMarkers() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
}

/*	Function: reset()
 *	Called when user clicks on "Reset" button. Clears the map and all settings.
 *	DO NOT EDIT
 */
function reset() {
	clearMarkers();
	markers = [];
	waypoints = [];
	origin = null;
	destination = null;
	directionsDisplay.setMap(null);
	directionsDisplay.setPanel(null);
	directionsDisplay = new google.maps.DirectionsRenderer();
	directionsDisplay.setMap(map);
	directionsDisplay.setPanel(document.getElementById("directionsPanel"));    
}


/************** 	3. Route Calculations	 ****************/
// TODO: These functions calculate the route the user should take to get from point A to B.
// You will need to help write code that determines the SAFEST route (fastest is already given)


/*	Function: getSafestRoute(routes)
 *	TODO: Return safest route of the array of routes
 *	
 * 	Currently only returns the first route in the array of routes.
 */
function getSafestRoute(routes) {

	// TODO: Understand how routes is structured and return safest route
	return routes[0];
}

/*	Function: calcFastestRoute()
 *	Called when user clicks "Get Directions" button. Calculates routes and returns fastest routes to user.
 */
function calcRoute(safest) {
	// Make sure we have an origin and destination at minimum.
	if (origin == null) {
    	alert("Click on the map to add a start point");
    	return;
  	}
  
  	if (destination == null) {
    	alert("Click on the map to add an end point");
    	return;
 	}
  
	var mode = google.maps.DirectionsTravelMode.WALKING;
  
  	var request = {
		origin: origin,
		destination: destination,
		waypoints: waypoints,
		travelMode: mode,
		optimizeWaypoints: true,
		avoidHighways: true,
		avoidTolls: true,
		provideRouteAlternatives: true
	};

	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			var editedResponse = response;
			if (safest) {
				var bestRoute = getSafestRoute(response.routes);		// Pass in all routes and returns safest route
				editedResponse.routes = [bestRoute];					// Set response routes variable to have only the safest route
			} else {
				editedResponse.routes = [response.routes[0]];
			}
			directionsDisplay.setDirections(editedResponse);
		}
  	});
  
	clearMarkers();
}
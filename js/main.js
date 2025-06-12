// Using Leaflet for creating the map and adding controls for interacting with the map

//
//--- Part 1: adding base maps ---
//

//creating the map; defining the location in the center of the map (geographic coords) and the zoom level. These are properties of the leaflet map object
//the map window has been given the id 'map' in the .html file
var map = L.map('map', {
	center: [47.5, 13.05],
	zoom: 8
});


//adding base map/s 

// add open street map as base layer
var osmap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
	

// for using the two base maps in the layer control, I defined a baseMaps variable
var baseMaps = {
	"Open Street Map": osmap
}

//
//---- Part 2: Adding a scale bar
//
L.control.scale({position:'bottomright',imperial:false}).addTo(map);

//
//---- Part 3: adding GeoJSON line features 
//

//Task: please add here the GEOJSON line features contained in the mwalk file





//
//---- Part 4: adding an event to the map
//

//when you click in the map, an alert with the latitude and longitude coordinates of the click location is shown
// e is the event object that is created on mouse click

//Task: change the event type from click to doubleclick

/*
map.addEventListener('click', function(e) {
    alert(e.latlng);
});
*/



//the same functionality can be realized with reference to the function onClick

/*
//definition of the function onClick
function onClick(evt){
	alert(evt.latlng);
}
*/
//map.addEventListener('click', onClick);

//short version (on is an alias for addEventListener):
//map.on('click', onClick);


//
//---- Part 5: Adding GeoJSON features and interactivity
//

var parks;


function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

parks = L.geoJson(npark, {
    style: {
		color: "#D34137",
		weight: 5},
    onEachFeature: function (feature, layer) {
        layer.on('click', zoomToFeature);}
		//you can also write:
		//layer.on({click: zoomToFeature}); }
});


parks.addTo(map); 



//
//---- Part 6: Adding GeoJSON features and several forms of interactivity
//comment out part 5 before testing part 6
 
/*
function highlightFeature(e) {
    var activefeature = e.target;  //access to activefeature that was hovered over through e.target
	
    activefeature.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
	
    if (!L.Browser.ie && !L.Browser.opera) {
        activefeature.bringToFront();
    }
}


//function for resetting the highlight
function resetHighlight(e) {
	parks.resetStyle(e.target);
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

//to call these methods we need to add listeners to our features

function interactiveFunction(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
   } );
}

var myParkStyle = {
    color: "#D34137",
    weight: 5,
    opacity: 0.65
}

parks = L.geoJson(npark, {
    style: myParkStyle,
    onEachFeature: interactiveFunction
}).addTo(map); 
 
*/


//
//---- Part 7: adding GeoJSON point features to marker object
//

//Task: extend the content of the Popup with the height information and the latlng coordinates of the summits

var summitsJson = {
"type":"FeatureCollection",
"features":[{"type":"Feature","properties":{"NAME":"Kreuzkogel","HEIGHT":2027},"geometry":{"type":"Point","coordinates":[13.153268433907614,47.22421002245328]}},
{"type":"Feature","properties":{"NAME":"Fulseck","HEIGHT":2034},"geometry":{"type":"Point","coordinates":[13.147417093794559,47.23423788545316]}}, 
{"type":"Feature","properties":{"NAME":"Kieserl","HEIGHT":1953},"geometry":{"type":"Point","coordinates":[13.152967420479607,47.24300413792524]}}]};


 var myIconsummit = L.icon({
	iconUrl: 'css/images/Summit.png',
	iconSize: [18, 18]
}); 


var summits = L.geoJson(summitsJson, {
	pointToLayer: function(feature, latlng) {
		return  L.marker(latlng, {icon:myIconsummit, title: "Summits in Salzburg"});
	},
	onEachFeature: function(feature, marker) {
		marker.bindPopup("Summit: " +'<br>'+'<b>' +feature.properties.NAME);
	}
});

summits.addTo(map);



//
//---- Part 8: Adding a layer control for base maps and feature layers
//

//the variable features lists layers that I want to control with the layer control
var features = {
	"Summits": summits,
	"National parks": parks
}

//the legend uses the layer control with entries for the base maps and two of the layers we added
//in case either base maps or features are not used in the layer control, the respective element in the properties is null

L.control.layers(null, features, {position:'topleft'}).addTo(map);







var CartoDB_Voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
});

var map = L.map('map', {
	center: [47.8, 13.045],
	zoom: 15,
	layers: [CartoDB_Voyager]
});

L.control.scale({position: 'bottomleft', imperial: false}).addTo(map);


line = L.JSON(line, {
    style: {
		color: "#D34137",
		weight: 5},
    onEachFeature: function (feature, layer) {
        layer.on('click', zoomToFeature);}
		//you can also write:
		//layer.on({click: zoomToFeature}); }
});


run.addTo(); 

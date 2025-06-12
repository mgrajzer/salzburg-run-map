var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
});

var map = L.map('map', {
	center: [47.8, 13.045],
	zoom: 15,
	layers: [CartoDB_Positron]
});

L.control.scale({position: 'bottomleft', imperial: false}).addTo(map);

var CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
});

var map = L.map('map', {
	center: [47.8, 13.045],
	zoom: 15,
	layers: [CartoDB_DarkMatter]
});

L.control.scale({position: 'bottomleft', imperial: false}).addTo(map);

fetch('data/run.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    L.geoJSON(data, {
      style: {
        color: '#FF005A',
        weight: 4
      },
      onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.name) {
          layer.bindPopup(feature.properties.name);
        }
      }
    }).addTo(map);
  })
  .catch(error => {
    console.error('Error loading run.json:', error);
  });

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("welcome-modal");
  const btn = document.getElementById("close-modal");

  btn.addEventListener("click", () => {
    const content = modal.querySelector(".modal-content");
    content.classList.add("slide-out");

    // Poczekaj na koniec animacji, potem ukryj cały modal
    content.addEventListener("animationend", () => {
      modal.style.display = "none";
    }, { once: true });
  });
});
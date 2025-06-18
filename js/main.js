var Jawg_Dark = L.tileLayer('https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=DVgdgfOJEczJSzOxV0oBnkANkVhYDyXacvcEqQMGhe6dMZh30EroBJgdHqEesjTM', {
	attribution: '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 0,
	maxZoom: 22,
	tileSize: 256,
	accessToken: 'DVgdgfOJEczJSzOxV0oBnkANkVhYDyXacvcEqQMGhe6dMZh30EroBJgdHqEesjTM'
});

var map = L.map('map', {
	center: [47.8, 13.045],
	zoom: 15,
	layers: [Jawg_Dark]
});

L.control.scale({position: 'bottomleft', imperial: false}).addTo(map);

fetch('data/points.json')
  .then(response => response.json())
  .then(data => {

    // Różne ikony dla różnych typów
    const icons = {
      1: L.icon({
        iconUrl: 'css/images/icon-mcdonald.svg',
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -30]
      }),
      2: L.icon({
        iconUrl: 'css/images/icon-wc.svg',
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -30]
      }),
      default: L.icon({
        iconUrl: 'css/images/icon-default.svg',
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -30]
      })
    };

    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        const type = feature.properties["Note Type"];
        const icon = icons[type] || icons.default;
        return L.marker(latlng, { icon: icon });
      },
      onEachFeature: function (feature, layer) {
        const props = feature.properties;

        const title = `<div class="popup-title">${props.Name}</div>`;
        const hours = props["Opening Hours"]
          ? `<div class="popup-hours"><i class="fa-regular fa-clock"></i> ${props["Opening Hours"]}</div>`
          : '';
        const notes = props.Notes
          ? `<div class="popup-notes">${props.Notes}</div>`
          : '';

        const popupContent = `<div class="custom-popup">${title}${hours}${notes}</div>`;
        layer.bindPopup(popupContent, { className: 'leaflet-popup-custom' });
      }
    }).addTo(map);
  })
  .catch(error => {
    console.error('Error loading points.json:', error);
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
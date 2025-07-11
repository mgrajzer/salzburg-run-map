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


fetch('data/paths.geojson')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    const defaultStyle = {
      color: '#FF005A',
      weight: 4
    };

    const highlightStyle = {
      color: '#FF3380',
      weight: 6
    };

    function pulseEffect(layer) {
      const originalColor = layer.options.color;
      let count = 0;
      const maxPulse = 6;

      const pulseInterval = setInterval(() => {
        layer.setStyle({
          color: count % 2 === 0 ? '#FF66A0' : originalColor,
          weight: 6
        });
        count++;
        if (count > maxPulse) {
          clearInterval(pulseInterval);
          layer.setStyle(defaultStyle);
        }
      }, 200);
    }

    L.geoJSON(data, {
      style: defaultStyle,
      onEachFeature: function (feature, layer) {
        const content = feature.properties
          ? `<strong>${feature.properties.PathName}</strong><br>${feature.properties.PathNotes || ''}`
          : '';

        layer.bindTooltip('', {
          sticky: true,
          direction: 'auto',
          opacity: 0
        });

        layer.on('mouseover', function () {
          layer.setStyle(highlightStyle);
        });

        layer.on('mouseout', function () {
          layer.setStyle(defaultStyle);
        });

        layer.on('click', function () {
          pulseEffect(layer);
          layer.bindPopup(content).openPopup();
        });
      }
    }).addTo(map);
  })
  .catch(error => {
    console.error('Error loading paths.geojson:', error);
  });
  
fetch('data/points.geojson')
  .then(response => response.json())
  .then(data => {

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
        const type = feature.properties.NoteType;
        const icon = icons[type] || icons.default;
        return L.marker(latlng, { icon: icon });
      },
      onEachFeature: function (feature, layer) {
        const props = feature.properties;

		const title = `<div class="popup-title"><strong>${props.Name}</strong></div>`;
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

const ResetViewControl = L.Control.extend({
  onAdd: function (map) {
    const btn = L.DomUtil.create('div', 'leaflet-bar reset-view-btn');
    btn.innerHTML = '<i class="fa-solid fa-house"></i>';
    btn.title = "Reset view";

    L.DomEvent.on(btn, 'click', function (e) {
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);
      map.setView([47.8, 13.045], 15);
    });

    return btn;
  },
  onRemove: function () {}
});

map.addControl(new ResetViewControl({ position: 'topleft' }));

let isMeasuring = false;
let measurePoints = [];
let measureLine = null;
let distanceLabel = null;
let totalDistance = 0;

function formatDistance(meters) {
  return meters > 1000
    ? (meters / 1000).toFixed(2) + ' km'
    : Math.round(meters) + ' m';
}

// START pomiaru
let clearControl = null;

function enableMeasuring() {
  isMeasuring = true;
  measurePoints = [];
  totalDistance = 0;

  // Aktywuj eventy
  map.on('click', onMeasureClick);
  map.on('dblclick', finishMeasuring);

  // Dodaj kosz (jeśli jeszcze nie istnieje)
  if (!clearControl) {
    clearControl = new ClearMeasureControl({ position: 'topleft' });
    map.addControl(clearControl);
  }
}

// Obsługa pojedynczego kliknięcia
function onMeasureClick(e) {
  measurePoints.push(e.latlng);

  if (measurePoints.length > 1) {
    const last = measurePoints[measurePoints.length - 2];
    const current = e.latlng;
    const segment = map.distance(last, current);
    totalDistance += segment;
  }

  if (measureLine) map.removeLayer(measureLine);
  measureLine = L.polyline(measurePoints, {
    color: '#FF005A',
    weight: 3,
    dashArray: '4 6'
  }).addTo(map);

  if (distanceLabel) map.removeLayer(distanceLabel);
  distanceLabel = L.marker(e.latlng, {
    icon: L.divIcon({
      className: 'distance-label',
      html: `<div>${formatDistance(totalDistance)}</div>`,
      iconAnchor: [0, 0]
    })
  }).addTo(map);
}

// Zakończ pomiar
function finishMeasuring() {
  map.off('click', onMeasureClick);
  map.off('dblclick', finishMeasuring);
  isMeasuring = false;
}

const MeasureControl = L.Control.extend({
  onAdd: function () {
    const btn = L.DomUtil.create('div', 'leaflet-bar measure-btn');
    btn.innerHTML = '<i class="fa-solid fa-ruler"></i>';
    btn.title = "Measure distance";

    L.DomEvent.on(btn, 'click', function (e) {
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);
      if (!isMeasuring) {
        enableMeasuring();
      }
    });

    return btn;
  },
  onRemove: function () {}
});

map.addControl(new MeasureControl({ position: 'topleft' }));

const ClearMeasureControl = L.Control.extend({
  onAdd: function () {
    const btn = L.DomUtil.create('div', 'leaflet-bar clear-measure-btn');
    btn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    btn.title = "Clear measurement";

    L.DomEvent.on(btn, 'click', function (e) {
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);
	  
	  if (clearControl) {
		map.removeControl(clearControl);
		clearControl = null;
}

      // Usuń linie, etykiety, punkty
      if (measureLine) {
        map.removeLayer(measureLine);
        measureLine = null;
      }
      if (distanceLabel) {
        map.removeLayer(distanceLabel);
        distanceLabel = null;
      }
      measurePoints = [];
      totalDistance = 0;
      isMeasuring = false;
      map.off('click', onMeasureClick);
      map.off('dblclick', finishMeasuring);
    });

    return btn;
  },
  onRemove: function () {}
});



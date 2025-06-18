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
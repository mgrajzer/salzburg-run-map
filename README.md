# Salzburg Run Map 0.2

This project is an interactive web map built using the Leaflet library with Jawg Dark map tiles. It displays running paths and points of interest loaded from GeoJSON files, supports measuring distances between points, and includes controls for resetting the map view. This map was created as part of the course **Geovisualization and Advanced Cartography**, taught by **Dr. Merve Keskin**, during the summer semester of 2025 at **The Paris Lodron University of Salzburg**.

## Features

- Dark-themed base map using Jawg Dark tiles.
- Display of running paths (`paths.geojson`) with animated highlight effect and popups.
- Display of points of interest (`points.geojson`) with canva-made icons and popups.
- Distance measurement tool with clickable points and a clear measurement button.
- Reset view button to return the map to its initial position.
- Welcome modal with introductory information.

## Technologies Used

- [Leaflet](https://leafletjs.com/) - JavaScript library for interactive maps.
- [Jawg Maps](https://jawg.io/) - Map tile provider.
- GeoJSON - Standard format for encoding geographic data.
- HTML, CSS, JavaScript.
- ChatGPT (OpenAI) - used for code cleanup and refactoring.

## Project Structure

- `index.html` - main HTML file.
- `css/` - folder containing styles and icons.
- `data/paths.geojson` - GeoJSON file with running paths.
- `data/points.geojson` - GeoJSON file with points of interest.
- `js/main.js` - main JavaScript file handling map logic.

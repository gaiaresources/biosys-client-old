import * as L from 'leaflet';

export let LAYER_OSM: L.TileLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Open Street Map'
    });

export let WA_CENTER: L.LatLng = L.latLng([-27, 121]);

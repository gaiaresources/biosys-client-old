import { Component, OnInit } from "@angular/core";
//import { Map } from 'leaflet';

@Component({
    moduleId: module.id,
    selector: 'map',
    templateUrl: 'map.component.html',
    styleUrls: ['map.component.css'],
})

export class MapComponent implements OnInit {
    private baseMaps: any;

    /**
     */
    constructor() {
        console.log('map');
//        this.baseMaps = {
//            OpenStreetMap: new L.TileLayer("http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
//                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
//            }),
//            Esri: new L.TileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
//                attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
//            }),
//            CartoDB: new L.TileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
//                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
//            })
//        };
    }

    ngOnInit() {
        console.log('map');

//        let map:Map = new L.Map('map', {
//            zoomControl: false,
//            center: new L.LatLng(40.731253, -73.996139),
//            zoom: 12,
//            minZoom: 4,
//            maxZoom: 19,
//            //layers: [this.mapService.baseMaps.OpenStreetMap]
//        });
//
//        L.control.zoom({ position: 'topright' }).addTo(map);
//        L.control.layers(this.baseMaps).addTo(map);
//        L.control.scale().addTo(map);
    }
}

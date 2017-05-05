import { OnInit, Component, Input, OnChanges, SimpleChange, ViewChild } from '@angular/core';
import { WA_CENTER } from '../../shared/index';
import * as L from 'leaflet';
import 'leaflet-draw';

@Component({
    moduleId: module.id,
    selector: 'biosys-featuremap',
    templateUrl: 'featuremap.component.html',
    styleUrls: ['featuremap.component.css'],
})
export class FeatureMapComponent implements OnInit, OnChanges {
    @Input() public drawFeatureTypes: [string] = [] as [string];
    @Input() public isEditing: boolean;
    @Input() public geometry: GeoJSON.DirectGeometryObject;
    @Input() public extraMarkers: [any];

    public layersControlOptions: any = {
        position: 'bottomleft'
    };

    private drawOptions: any;

    private map: L.Map;
    private drawControl: L.Control.Draw;
    private drawnFeatures: L.FeatureGroup = L.featureGroup();
    private drawnFeatureType: string;

    private initialised: boolean;

    constructor() {
        this.initialised = false;
    }

    ngOnInit() {
        this.drawOptions = {
            position: 'bottomright',
            draw: {
                polyline: this.drawFeatureTypes.indexOf('LINE') > -1,
                polygon: this.drawFeatureTypes.indexOf('POLYGON') > -1,
                rectangle: this.drawFeatureTypes.indexOf('POLYGON') > -1,
                circle: false,
                marker: this.drawFeatureTypes.indexOf('POINT') > -1
            },
            edit: {
                featureGroup: this.drawnFeatures
            }
        };

        this.initialised = true;

        this.map = L.map('map', {
            zoom: 4,
            center: WA_CENTER
        });
        this.map.addLayer(L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: 'Open Street Map'
        }));
        this.map.addLayer(this.drawnFeatures);
        this.map.on('draw:created', (e: any) => this.onFeatureCreated(e));

        this.drawControl = new L.Control.Draw(this.drawOptions);

        if (this.isEditing) {
            this.map.addControl(this.drawControl);
        }

        let icon: L.Icon = L.icon({
            iconUrl: 'assets/img/extra-marker-icon.png',
            shadowUrl: 'assets/img/marker-shadow.png'
        });

        if (this.extraMarkers) {
            for(let marker of this.extraMarkers) {
                let coord: GeoJSON.Position = marker.geometry.coordinates as GeoJSON.Position;
                let leafletMarker: L.Marker = L.marker(L.GeoJSON.coordsToLatLng([coord[0], coord[1]]), {icon: icon});
                leafletMarker.bindPopup(marker.text);
                this.map.addLayer(leafletMarker);
            }
        }
    }

    ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
        if (changes['geometry']) {
            this.drawnFeatures.clearLayers();
            if (this.geometry) {
                if (this.geometry.type === 'LineString') {
                    let polyline: L.Polyline = L.polyline(L.GeoJSON.coordsToLatLngs(this.geometry.coordinates));
                    this.drawnFeatures.addLayer(polyline);
                    this.drawnFeatureType = 'polyline';
                } else if (this.geometry.type === 'Polygon') {
                    let coords: GeoJSON.Position[] = this.geometry.coordinates[0] as GeoJSON.Position[];
                    let polygon: L.Polygon = L.polygon(L.GeoJSON.coordsToLatLngs(coords));
                    this.drawnFeatures.addLayer(polygon);
                    this.drawnFeatureType = 'polygon';
                } else if (this.geometry.type === 'Point') {
                    let coord: GeoJSON.Position = this.geometry.coordinates as GeoJSON.Position;
                    let marker: L.Marker = L.marker(L.GeoJSON.coordsToLatLng([coord[0], coord[1]]));
                    this.drawnFeatures.addLayer(marker);
                    this.drawnFeatureType = 'point';
                }
            }
        }

        if (changes['isEditing']) {
            if (this.initialised) {
                if (this.isEditing) {
                    this.map.addControl(this.drawControl);
                } else {
                    this.map.removeControl(this.drawControl);
                }
            }
        }
    }

    public getFeatureGeometry(): GeoJSON.DirectGeometryObject {
        let geom: GeoJSON.DirectGeometryObject = null;

        if (this.drawnFeatures.getLayers().length > 0) {
            if (this.drawnFeatureType === 'polygon' || this.drawnFeatureType === 'rectangle') {
                return (<L.Polygon>this.drawnFeatures.getLayers()[0]).toGeoJSON().geometry;
            } else if (this.drawnFeatureType === 'polyline') {
                return (<L.Polyline>this.drawnFeatures.getLayers()[0]).toGeoJSON().geometry;
            } else if (this.drawnFeatureType === 'marker') {
                return (<L.CircleMarker>this.drawnFeatures.getLayers()[0]).toGeoJSON().geometry;
            }
        }

        return geom;
    }

    private onFeatureCreated(e: any) {
        this.drawnFeatures.clearLayers();
        this.drawnFeatures.addLayer(e.layer);
        this.drawnFeatureType = e.layerType;
    }
}

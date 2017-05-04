import { OnInit, Component, Input, OnChanges, SimpleChange, ViewChild } from '@angular/core';
import { LAYER_OSM, WA_CENTER } from '../../shared/index';
import * as L from 'leaflet';
import 'leaflet-draw';

// import { MapComponent, LayerVectorComponent } from 'angular2-openlayers';
// import { Collection, Feature, Coordinate, control, coordinate, source, interaction, proj, geom } from 'openlayers';

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

    public baseLayers: any = {
        'Open Street Map': LAYER_OSM
    };

    public mapOptions: any = {
        zoom: 4,
        center: WA_CENTER
    };

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
                    let coords: GeoJSON.Position = this.geometry.coordinates[0] as GeoJSON.Position;
                    let polygon: L.Polygon = L.polygon(L.GeoJSON.coordsToLatLngs(coords));
                    this.drawnFeatures.addLayer(polygon);
                    this.drawnFeatureType = 'polygon';
                } else if (this.geometry.type === 'Point') {
                    let marker: L.GeoJSON = L.geoJSON(this.geometry); // L.geoJSON will convert to marker if it's a point
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

    public onMapReady(map: L.Map) {
        this.map = map;
        this.map.addLayer(this.drawnFeatures);
        this.map.on('draw:created', (e: any) => this.onFeatureCreated(e));

        this.drawControl = new L.Control.Draw(this.drawOptions);

        if (this.initialised) {
            if (this.isEditing) {
                this.map.addControl(this.drawControl);
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

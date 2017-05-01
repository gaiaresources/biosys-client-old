import { OnInit, Component, Input, OnChanges, SimpleChange, ViewChild } from '@angular/core';
import { Geometry } from '../../shared/index';
// import { MapComponent, LayerVectorComponent } from 'angular2-openlayers';
// import { Collection, Feature, Coordinate, control, coordinate, source, interaction, proj, geom } from 'openlayers';

@Component({
    moduleId: module.id,
    selector: 'biosys-featuremap',
    templateUrl: 'featuremap.component.html',
    styleUrls: [],
})
export class FeatureMapComponent implements OnInit, OnChanges {
    @Input() public isEditing: boolean;
    @Input() geometry: Geometry;

    // @ViewChild(MapComponent)
    // private mapComponent: MapComponent;

    // @ViewChild(LayerVectorComponent)
    // private layerVectorComponent: LayerVectorComponent;

    // private sourceVector: source.Vector;

    // private mousePosition: control.MousePosition;

    // private features: Collection<Feature>;

    // private select: interaction.Select;
    // private modify: interaction.Modify;
    // private draw: interaction.Draw;

    private initialised: boolean;

    constructor() {
        this.initialised = false;
    }

    ngOnInit() {
        // this.sourceVector = new source.Vector({useSpatialIndex: false});
        // this.layerVectorComponent.setSource(this.sourceVector);

        // this.mousePosition = new control.MousePosition({
        //     coordinateFormat: coordinate.createStringXY(4),
            // projection: 'EPSG:4326'
        // });

        // if (this.isEditing) {
        //     if (this.features) {
        //         this.startModification();
        //     } else {
        //         this.startDrawing();
        //     }
        // }

        this.initialised = true;
    }

    ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
        // if (changes['geometry']) {
        //     if (this.geometry) {
        //         let olGeom: geom.Geometry = null;
        //         if (this.geometry.type === 'LineString') {
        //             let newCoords: Array<Coordinate> = [];
        //             this.geometry.coordinates.forEach(function (coord: Coordinate) {
        //                 newCoords.push(proj.fromLonLat(coord));
        //             });
        //             olGeom = new geom.LineString(newCoords);
        //         }
        //
        //         if (!this.features) {
        //             this.features = this.sourceVector.getFeaturesCollection();
        //         }
        //
        //         this.features.clear();
        //         this.features.insertAt(0, new Feature({geometry: olGeom}));
        //
        //         if (this.initialised && this.isEditing) {
        //             this.endDrawingModification();
        //             this.startModification();
        //         }
        //     }
        // }
        //
        // if (changes['isEditing']) {
        //     if (this.initialised) {
        //         if (this.isEditing) {
        //             if (this.features) {
        //                 this.startModification();
        //             } else {
        //                 this.startDrawing();
        //             }
        //         } else {
        //             this.endDrawingModification();
        //         }
        //     }
        // }
    }

    public getFeatureGeometry()/*: Geometry */{
        // if (!this.features || !this.features.getLength()) {
        //     return null;
        // }
        //
        // let feature: Feature = this.features.item(0);
        //
        // let newCoords: Array<Coordinate> = [];
        // // The next line is just to keep the tslint quiet because the class geom.Geometry doesn't have a getCoordinate()
        // // method while all its subclasses (Point, Polygon, ...) have!
        // let geom = <any>feature.getGeometry();
        // if (geom) {
        //     geom.getCoordinates().forEach(function (coord: Coordinate) {
        //         newCoords.push(proj.toLonLat(coord));
        //     });
        //     return {type: geom.getType(), coordinates: newCoords};
        // } else {
        //     return null;
        // }
    }

    public startDrawing() {
        // this.draw = new interaction.Draw({
        //     type: 'LineString',
        //     source: this.sourceVector
        // });
        //
        // this.draw.on('drawend', (drawEvent: interaction.DrawEvent) => this.drawEnded(drawEvent));
        // this.mapComponent.addInteraction(this.draw);
        //
        // this.mousePosition.setMap(this.mapComponent);
    }

    public startModification() {
        // this.select = new interaction.Select({wrapX: false});
        // this.modify = new interaction.Modify({features: this.select.getFeatures()});
        //
        // this.mapComponent.addInteraction(this.select);
        // this.mapComponent.addInteraction(this.modify);
        //
        // this.mousePosition.setMap(this.mapComponent);
    }

    private drawEnded(/*drawEvent: interaction.DrawEvent*/) {
        // this.mapComponent.removeInteraction(this.draw);
        //
        // if (!this.features) {
        //     this.features = this.sourceVector.getFeaturesCollection();
        // }
        //
        // this.startModification();
    }

    private endDrawingModification() {
        // this.mapComponent.removeInteraction(this.select);
        // this.mapComponent.removeInteraction(this.modify);
        // this.mapComponent.removeInteraction(this.draw);
        //
        // this.mousePosition.setMap(null);
    }
}

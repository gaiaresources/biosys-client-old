import { OnInit, Component, Input, OnChanges, SimpleChange, ViewChild } from '@angular/core';
import { Geometry } from '../../shared/index';
import { MapComponent, LayerVectorComponent } from 'angular2-openlayers';
import { Collection, Feature, Coordinate, source, interaction, proj, geom } from 'openlayers';

@Component({
    moduleId: module.id,
    selector: 'biosys-featuremap',
    templateUrl: 'featuremap.component.html',
    styleUrls: ['featuremap.component.css'],
})
export class FeatureMapComponent {
    @Input() isEditing: boolean;
    @Input() geometry: Geometry;

    @ViewChild(MapComponent)
    private mapComponent: MapComponent;

    @ViewChild(LayerVectorComponent)
    private layerVectorComponent: LayerVectorComponent;

    private sourceVector: source.Vector;

    private features: Collection<Feature>;

    private select:interaction.Select;
    private modify:interaction.Modify;
    private draw:interaction.Draw;

    ngOnInit() {
        this.sourceVector = new source.Vector({useSpatialIndex: false});
        this.layerVectorComponent.setSource(this.sourceVector);
    }

    ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
        if (changes['geometry']) {
            if (!this.geometry) {
                return;
            }

            let olGeom: geom.Geometry = null;
            if (this.geometry.type === 'LineString') {
                let newCoords: Array<Coordinate> = [];
                this.geometry.coordinates.forEach(function (coord: Coordinate) {
                    newCoords.push(proj.fromLonLat(coord));
                });
                olGeom = new geom.LineString(newCoords);
            }

            if (!this.features) {
                this.features = this.sourceVector.getFeaturesCollection();
            }

            this.features.clear();
            this.features.insertAt(0, new Feature({geometry: olGeom}));
        } else if (changes['isEditing']) {
            if (this.isEditing) {
                if (this.features) {
                    this.startModification();
                } else {
                    this.startDrawing();
                }
            } else {
                this.endDrawingModification();
            }
        }
    }

    public getFeatureGeometry(): Geometry {
        this.endDrawingModification();

        if (!this.features || !this.features.getLength()) {
            return null;
        }

        let feature:Feature = this.features.item(0);

        let newCoords: Array<Coordinate> = [];
        feature.getGeometry().getCoordinates().forEach(function (coord: Coordinate) {
            newCoords.push(proj.toLonLat(coord));
        });

        let geometry:Geometry = {type: feature.getGeometry().getType(), coordinates: newCoords};

        return geometry;
    }

    private drawEnded(drawEvent: interaction.DrawEvent) {
        this.mapComponent.removeInteraction(this.draw);

        if (!this.features) {
            this.features = this.sourceVector.getFeaturesCollection();
        }

        this.startModification();
    }

    private startDrawing() {
        this.draw = new interaction.Draw({
            type: 'LineString',
            source: this.sourceVector
        });

        this.draw.on('drawend', (drawEvent: interaction.DrawEvent) => this.drawEnded(drawEvent));
        this.mapComponent.addInteraction(this.draw);
    }

    private startModification() {
        this.select = new interaction.Select({wrapX: false});
        this.modify = new interaction.Modify({features: this.select.getFeatures()});

        this.mapComponent.addInteraction(this.select);
        this.mapComponent.addInteraction(this.modify);
    }

    private endDrawingModification() {
        this.mapComponent.removeInteraction(this.select);
        this.mapComponent.removeInteraction(this.modify);
        this.mapComponent.removeInteraction(this.draw);
    }
}

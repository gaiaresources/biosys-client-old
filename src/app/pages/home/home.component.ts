import { Component, OnInit } from '@angular/core';
import { APIService, APIError, Project, Statistic, User } from '../../shared/index';
import * as L from 'leaflet';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'biosys-home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css'],
})

export class HomeComponent implements OnInit {
    public LAYER_OSM = {
        id: 'openstreetmap',
        name: 'Open Street Map',
        enabled: false,
        layer: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: 'Open Street Map'
        })
    };

    public BASE_LAYERS = {
        'Open Street Map': this.LAYER_OSM.layer
    };
    public OPTIONS = {
        zoom: 4,
        center: L.latLng([ -27, 121 ])
    };

    public projects: Project[];
    public statistic: Statistic;
    public user: User;

    private map: L.Map;

    constructor(public apiService: APIService) {}

    ngOnInit() {
        this.apiService.getProjects()
            .subscribe(
                (projects: Project[]) => {
                    this.projects = projects;
                    this.loadProjectMarkers();
                },
                (error: APIError) => console.log('error.msg', error.msg)
            );

        this.apiService.getStatistics()
            .subscribe(
                (statistic: Statistic) => this.statistic = statistic,
                (error: APIError) => console.log('error.msg', error.msg)
            );

        this.apiService.whoAmI()
            .subscribe(
                (user: User) => this.user = user,
                (error: APIError) => console.log('error.msg', error.msg)
            );
    }

    public onMapReady(map: L.Map) {
        this.map = map;
    }

    private loadProjectMarkers() {
        for (let project of this.projects) {
            if(project.centroid) {
                let marker:L.Marker = L.marker([project.centroid.coordinates[1], project.centroid.coordinates[0]]);
                marker.bindPopup(project.title);
                marker.addTo(this.map);
            }
        }
    }
}

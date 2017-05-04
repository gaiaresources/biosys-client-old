import { Component, OnInit } from '@angular/core';
import { APIService, APIError, Project, Statistic, User, LAYER_OSM, WA_CENTER } from '../../shared/index';
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
    public base_layers: any = {
        'Open Street Map': LAYER_OSM
    };

    public map_options: any = {
        zoom: 4,
        center: WA_CENTER
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
                let marker = L.geoJSON(project.centroid).addTo(this.map);
                marker.bindPopup(project.title);
                marker.addTo(this.map);
            }
        }
    }
}

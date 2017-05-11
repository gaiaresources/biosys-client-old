import { Component, OnInit } from '@angular/core';
import { APIService, APIError, Project, Statistic, User, WA_CENTER } from '../../shared/index';
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

        this.map = L.map('map', {
            zoom: 4,
            center: WA_CENTER
        });

        this.map.addLayer(L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: 'Open Street Map'
        }));
    }

    public onMapReady(map: L.Map) {
        this.map = map;
    }

    private loadProjectMarkers() {
        for (let project of this.projects) {
            if(project.centroid) {
                let marker = L.geoJSON(project.centroid).addTo(this.map);
                let popupContent: string = '<p class="m-0"><strong>' + project.title + '</strong></p>';
                if (project.comments) {
                    popupContent += '<p class="mt-1">' + project.comments + '</p>';
                }
                marker.bindPopup(popupContent);
                marker.on('mouseover', function (e) {
                    this.openPopup();
                });
                marker.on('mouseout', function (e) {
                    this.closePopup();
                });
                marker.addTo(this.map);
            }
        }
    }
}

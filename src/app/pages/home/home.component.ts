import { Component, OnInit } from '@angular/core';
import { APIService, APIError, Observation } from '../../shared/index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css'],
})

export class HomeComponent implements OnInit {
    lat: number = -26.67;
    lng: number = 121.62;
    zoom: number = 5;
    observations: Observation[];

    constructor(public apiService: APIService) {}

    ngOnInit() {
        this.apiService.getAllObservations()
            .subscribe(
                (observations: Observation[]) => this.observations = observations,
                (error: APIError) => console.log('error.msg', error.msg)
            );
    }

}

import { Component, OnInit } from '@angular/core';
import { APIService, APIError, Observation, Statistic } from '../../shared/index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css', '../../../../node_modules/openlayers/dist/ol.css'],
})

export class HomeComponent implements OnInit {
    observations: Observation[];
    statistic: Statistic;

    constructor(public apiService: APIService) {}

    ngOnInit() {
        this.apiService.getAllObservations()
            .subscribe(
                (observations: Observation[]) => this.observations = observations,
                (error: APIError) => console.log('error.msg', error.msg)
            );

        this.apiService.getStatistics()
            .subscribe(
                (statistic: Statistic) => this.statistic = statistic,
                (error: APIError) => console.log('error.msg', error.msg)
            );
    }

}

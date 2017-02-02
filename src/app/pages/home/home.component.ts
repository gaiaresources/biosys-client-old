import { Component, OnInit } from '@angular/core';
import { APIService, APIError, Observation, Statistic, User } from '../../shared/index';

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
    public observations: Observation[];
    public statistic: Statistic;
    public user: User;

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

        this.apiService.whoAmI()
            .subscribe(
                (user: User) => this.user = user,
                (error: APIError) => console.log('error.msg', error.msg)
            );
    }

}

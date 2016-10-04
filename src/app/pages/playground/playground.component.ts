import {Component, OnInit} from '@angular/core';
import {APIService} from '../../shared/index';

@Component({
    moduleId: module.id,
    selector: 'bios-playground',
    templateUrl: 'playground.component.html',
    styleUrls: [],
})

export class PlaygroundComponent implements OnInit {
    projects: any[] = [];
    errorMessage: string;

    constructor(public apiService: APIService) {
    }

    ngOnInit() {
        this.getProjects();
    }

    getProjects() {
        this.apiService.getProjects()
            .subscribe(
                projects => this.projects = projects,
                error => this.errorMessage = <any>error
            );
    }

}

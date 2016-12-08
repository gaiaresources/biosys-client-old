import { Component, OnInit } from '@angular/core';
import { APIService, APIError, Project } from '../../shared/index';

@Component({
    moduleId: module.id,
    selector: 'bios-playground',
    templateUrl: 'playground.component.html',
    styleUrls: ['playground.component.css'],
})

export class PlaygroundComponent implements OnInit {
    projects: any[] = [];

    constructor(public apiService: APIService) {
    }

    ngOnInit() {
        this.apiService.getAllProjects()
            .subscribe(
                (projects: Project[]) => this.projects = projects,
                (error: APIError) => console.log('error.msg', error.msg)
            );
    }

}

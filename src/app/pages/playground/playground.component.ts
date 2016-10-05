import { Component, OnInit } from '@angular/core';
import { APIService, APIError } from '../../shared/index';

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
        this.apiService.authenticate('admin', 'password')
            .subscribe(
                () => {
                    this.getProjects();
                },
                (error: APIError) => console.log('error', error.msg)
            );
    }

    getProjects() {
        this.apiService.getAllProjects()
            .subscribe(
                projects => {
                    this.projects = projects;
                    for (let proj of projects) {
                        this.apiService.getProject(proj.id)
                            .subscribe(
                                project => console.log(project['title'], project),
                                (error: APIError) => console.log('error', error.msg)
                            );
                    }
                },
                error => this.errorMessage = <any>error
            );
    }

}

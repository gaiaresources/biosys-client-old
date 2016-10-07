import { Component, OnInit } from '@angular/core';
import { APIService, APIError, Project } from '../../shared/index';

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
        this.apiService.getAllProjects()
            .subscribe(
                (projects: Project[]) => this.projects = projects,
                (error: APIError) => console.log('error.msg', error.msg)
            );
        // this.apiService.authenticate('admin', 'password')
        //     .flatMap(
        //         () => this.apiService.getAllProjects()
        //     )
        //     .flatMap(
        //         (projects: Project[]) => {
        //             this.projects = projects;
        //             let newProjectTitle = 'Test from client';
        //             if (projects.map(p => p.title).indexOf(newProjectTitle) >= 0) {
        //                 newProjectTitle += '1';
        //             }
        //             return this.apiService.createProject({
        //                 title: newProjectTitle,
        //                 code: 'TST'
        //             });
        //         }
        //     )
        //     .subscribe(
        //         project => console.log('Project created', project),
        //         (error: APIError) => this.errorMessage = error.msg
        //     );
    }

}

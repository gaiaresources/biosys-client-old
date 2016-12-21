import { Component, OnInit } from '@angular/core';
import { APIService, APIError, Project } from '../../shared/index';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'bios-projects',
    templateUrl: 'projects.component.html',
    styleUrls: ['projects.component.css'],
})

export class ProjectsComponent implements OnInit {
    projects: Project[] = [];

    constructor(private apiService: APIService, private router: Router) {
    }

    ngOnInit() {
        this.apiService.getAllProjects()
            .subscribe(
                (projects: Project[]) => this.projects = projects,
                (error: APIError) => console.log('error.msg', error.msg)
            );
    }
}

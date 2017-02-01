import { Component, OnInit } from '@angular/core';
import { APIService, APIError, Project } from '../../../shared/index';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'biosys-data-project-list',
    templateUrl: 'list-projects.component.html',
    styleUrls: [],
})

export class DataListProjectsComponent implements OnInit {
    public breadcrumbItems: any = [];
    projects: Project[] = [];

    constructor(private apiService: APIService, private router: Router) {
    }

    ngOnInit() {
        this.apiService.getAllProjects()
            .subscribe(
                (projects: Project[]) => this.projects = projects,
                (error: APIError) => console.log('error.msg', error.msg)
            );

        this.breadcrumbItems = [
            {label:'Enter Data - Project List'},
        ];
    }

    onRowSelect(event:any) {
        this.router.navigate(['/data/projects/' + event.data.id + '/datasets']);
    }
}

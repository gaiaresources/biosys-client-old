import { Component, OnInit } from '@angular/core';
import { APIService, APIError, Project, Site, Dataset } from '../../../shared/index';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'bios-edit-roject',
    templateUrl: 'edit-project.component.html',
    styleUrls: ['edit-project.component.css'],
})

export class EditProjectComponent implements OnInit {
    private project: Project = <Project>{};
    private sites: Site[];
    private datasets: Dataset[];

    private isEditing: boolean;

    constructor(private apiService: APIService, private router: Router, private route: ActivatedRoute) {

    }

    ngOnInit() {
        this.isEditing = !('id' in this.route.snapshot.params);

        if (!this.isEditing) {
            this.apiService.getProjectById(Number(this.route.snapshot.params['id'])).subscribe(
                (project: Project) => this.project = project,
                (error: APIError) => console.log('error.msg', error.msg)
            );

            this.apiService.getAllDatasetsForProjectID(Number(this.route.snapshot.params['id'])).subscribe(
                (datasets: Dataset[]) => this.datasets = datasets,
                (error: APIError) => console.log('error.msg', error.msg)
            );

            this.apiService.getAllSitesForProjectID(Number(this.route.snapshot.params['id'])).subscribe(
                (sites: Site[]) => this.sites = sites,
                (error: APIError) => console.log('error.msg', error.msg)
            );
        }
    }

    saveProject() {
        if(this.project.id) {
            this.apiService.updateProject(this.project).subscribe(
                (project: Project) => this.project = project,
                (error: APIError) => console.log('error.msg', error.msg),
                () => this.isEditing = false
            );
        } else {
            this.apiService.createProject(this.project).subscribe(
                (project: Project) => this.project = project,
                (error: APIError) => console.log('error.msg', error.msg),
                () => this.isEditing = false
            );
        }
    }

    editProject() {
        this.isEditing = true;
    }
}

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

    constructor(private apiService: APIService, private router: Router, private route: ActivatedRoute) {

    }

    ngOnInit() {
        if ('id' in this.route.snapshot.params) {
            this.apiService.getProjectById(Number(this.route.snapshot.params['id'])).subscribe(
                (project: Project) => this.project = project,
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
                (project: Project) => this.router.navigate(['/projects']),
                (error: APIError) => console.log('error.msg', error.msg)
            );
        } else {
            this.apiService.createProject(this.project).subscribe(
                (project: Project) => this.router.navigate(['/projects']),
                (error: APIError) => console.log('error.msg', error.msg)
            );
        }
        // this.router.navigate(['/edit-project/edit-project/' + project.id]);
    }
}

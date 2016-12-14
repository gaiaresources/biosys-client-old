import { Component, OnInit } from '@angular/core';
import { APIService, APIError, Project } from '../../../shared/index';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'bios-edit-roject',
    templateUrl: 'edit-project.component.html',
    styleUrls: ['edit-project.component.css'],
})

export class EditProjectComponent implements OnInit {
    private project: Project;

    constructor(private apiService: APIService, private router: Router, private route: ActivatedRoute) {

    }

    ngOnInit() {
        if ('id' in this.route.snapshot.params) {
            this.apiService.getProjectById(Number(this.route.snapshot.params['id'])).subscribe(
                (project: Project) => this.project = project,
                (error: APIError) => console.log('error.msg', error.msg)
            );
        }
    }

    editProject(project: Project) {
        this.router.navigate(['/edit-project/edit-project/' + project.id]);
    }
}

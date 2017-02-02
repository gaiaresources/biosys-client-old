import { Component, OnInit } from '@angular/core';
import { APIService, APIError, Project } from '../../../shared/index';
import { Router } from '@angular/router';
import { ConfirmationService, Message } from 'primeng/primeng';

@Component({
    moduleId: module.id,
    selector: 'biosys-management-project-list',
    templateUrl: 'list-projects.component.html',
    styleUrls: [],
})

export class ManagementListProjectsComponent implements OnInit {
    public breadcrumbItems: any = [];
    public projects: Project[] = [];
    public msgs: Message[] = [];

    constructor(private apiService: APIService, private router: Router,
                private confirmationService: ConfirmationService) {
    }

    ngOnInit() {
        this.apiService.getProjects()
            .subscribe(
                (projects: Project[]) => this.projects = projects,
                (error: APIError) => console.log('error.msg', error.msg)
            );

        this.breadcrumbItems = [
            {label:'Management - Project List'}
        ];
    }

    public confirmDelete(project:Project) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this project?',
            accept: () => {
                this.apiService.deleteProject(project.id)
                    .subscribe(
                        () => this.onDeleteSuccess(project),
                        (error: APIError) => this.onDeleteError(error)
                    );
            }
        });
    }

    private onDeleteSuccess(project: Project) {
        for (let i = 0; i < this.projects.length; i++) {
            if (this.projects[i].id === project.id) {
                this.projects.splice(i, 1);
                break;
            }
        }

        this.msgs.push({
            severity: 'success',
            summary: 'Project deleted',
            detail: 'The project was deleted'
        });
    }

    private onDeleteError(projectError: any) {
        this.msgs.push({
            severity: 'error',
            summary: 'Project delete error',
            detail: 'There were error(s) deleting the project: ' + projectError.msg
        });
    }
}

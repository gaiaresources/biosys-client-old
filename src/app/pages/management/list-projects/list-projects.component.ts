import { Component, OnInit } from '@angular/core';
import { APIService, APIError, Project, User } from '../../../shared/index';
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
    public messages: Message[] = [];
    public custodiansString: string = '';

    private user:User;

    constructor(private apiService: APIService, private router: Router,
                private confirmationService: ConfirmationService) {
    }

    ngOnInit() {
        this.apiService.whoAmI()
            .toPromise()
            .then((user: User) => this.user = user,
                (error: APIError) => console.log('error.msg', error.msg)
            )
            .then(() => {
                if (this.user.is_superuser) {
                    this.apiService.getProjects().subscribe(
                        (projects: Project[]) => this.projects = projects,
                        (error: APIError) => console.log('error.msg', error.msg)
                    );
                } else {
                    this.apiService.getProjects([this.user.id]).subscribe(
                        (projects: Project[]) => this.projects = projects,
                        (error: APIError) => console.log('error.msg', error.msg)
                    );
                }
            }, (error: APIError) => console.log('error.msg', error.msg));

        this.apiService.getProjects()
            .subscribe(
                (projects: Project[]) => this.projects = projects,
                (error: APIError) => console.log('error.msg', error.msg)
            );

        this.breadcrumbItems = [
            {label:'Manage - Projects'}
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
        if (this.user.is_superuser) {
            this.apiService.getProjects().subscribe(
                (projects: Project[]) => this.projects = projects,
                (error: APIError) => console.log('error.msg', error.msg)
            );
        } else {
            this.apiService.getProjects([this.user.id]).subscribe(
                (projects: Project[]) => this.projects = projects,
                (error: APIError) => console.log('error.msg', error.msg)
            );
        }

        this.messages.push({
            severity: 'success',
            summary: 'Project deleted',
            detail: 'The project was deleted'
        });
    }

    private onDeleteError(projectError: any) {
        this.messages.push({
            severity: 'error',
            summary: 'Project delete error',
            detail: 'There were error(s) deleting the project: ' + projectError.msg
        });
    }
}

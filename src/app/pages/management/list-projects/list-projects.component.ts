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

    constructor(private apiService: APIService, private router: Router,
                private confirmationService: ConfirmationService) {
    }

    ngOnInit() {
        this.apiService.whoAmI().subscribe(
            (user: User) => {
                if(user.is_superuser) {
                    this.apiService.getProjects().subscribe(
                        (projects: Project[]) => this.projects = projects,
                        (error: APIError) => console.log('error.msg', error.msg)
                    );
                } else {
                    this.apiService.getProjects([user.id]).subscribe(
                        (projects: Project[]) => this.projects = projects,
                        (error: APIError) => console.log('error.msg', error.msg)
                    );
                }
            },
            (error: APIError) => console.log('error.msg', error.msg)
        );

        this.apiService.getProjects()
            .subscribe(
                (projects: Project[]) => this.projects = projects,
                (error: APIError) => console.log('error.msg', error.msg)
            );

        this.breadcrumbItems = [
            {label:'Management - Project List'}
        ];
    }

    public getCustodiansAsText(custodians: number[]): string {
        return '';
        // if (!custodians || !custodians.length) {
        //     return '';
        // }
        //
        // let users: User[] = [];
        //
        // for (let custodian of custodians) {
        //     this.apiService.getUser(custodian)
        //     .subscribe(
        //         (user: User) => users.push(user),
        //         (error: APIError) => console.log('error.msg', error.msg)
        //     );
        // }
        //
        // if (users.length) {
        //     return users.map(user => user.first_name + ' ' + user.last_name).reduce((a, b) => a + '; ' + b);
        // } else {
        //     return '';
        // }
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

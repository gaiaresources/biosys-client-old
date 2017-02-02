import { Component, OnInit, ViewChild } from '@angular/core';
import { APIService, APIError, User, Project, Site, Dataset, ModelChoice, FeatureMapComponent } from '../../../shared/index';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService, Message, SelectItem } from 'primeng/primeng';

@Component({
    moduleId: module.id,
    selector: 'biosys-edit-roject',
    templateUrl: 'edit-project.component.html',
    styleUrls: [],
})

export class EditProjectComponent implements OnInit {
    public breadcrumbItems: any = [];

    public project: Project = <Project>{};
    public sites: Site[];
    public datasets: Dataset[];

    public isEditing: boolean;

    public datamTypeChoices: SelectItem[];
    public custodianChoices: SelectItem[];

    public msgs: Message[] = [];

    @ViewChild(FeatureMapComponent)
    public featureMapComponent: FeatureMapComponent;

    constructor(private apiService: APIService, private router: Router, private route: ActivatedRoute,
        private confirmationService: ConfirmationService) {
    }

    ngOnInit() {
        let params = this.route.snapshot.params;

        this.isEditing = !('id' in params);

        if (!this.isEditing) {
            this.apiService.getProjectById(Number(params['id'])).subscribe(
                (project: Project) => {
                    this.project = project;
                    this.breadcrumbItems.push({label: 'Edit ' + this.project.title});
                },
                (error: APIError) => console.log('error.msg', error.msg)
            );

            this.apiService.getAllDatasetsForProjectID(Number(params['id'])).subscribe(
                (datasets: Dataset[]) => this.datasets = datasets,
                (error: APIError) => console.log('error.msg', error.msg)
            );

            this.apiService.getAllSitesForProjectID(Number(params['id'])).subscribe(
                (sites: Site[]) => this.sites = sites,
                (error: APIError) => console.log('error.msg', error.msg)
            );
        }

        this.apiService.getModelChoices('project', 'datum')
            .map(
                (choices: ModelChoice[]): SelectItem[] =>
                    choices.map((choice: ModelChoice): SelectItem => {
                        return {
                            label: choice.display_name,
                            value: choice.value
                        };
                    })
            )
            .subscribe(
                (choices: SelectItem[]) => this.datamTypeChoices = choices,
                (error: APIError) => console.log('error.msg', error.msg)
            );

        this.apiService.getUsers()
            .map(
                (users: User[]): SelectItem[] =>
                    users.map((user: User): SelectItem => {
                        return {
                            label: user.first_name + ' ' + user.last_name,
                            value: user.id
                        };
                    })
            )
            .subscribe(
                (users: SelectItem[]) => this.custodianChoices = users,
                (error: APIError) => console.log('error.msg', error.msg)
            );

        this.breadcrumbItems = [
            {label:'Management - Project List', routerLink: ['management/projects']},
        ];

        if (this.isEditing) {
            this.breadcrumbItems.push({label: 'Create Project'});
        }
    }

    public getDatumLabel(value: string): string {
        if (!this.datamTypeChoices) {
            return '';
        }

        return this.datamTypeChoices.filter(d => d.value === value).pop().label;
    }

    public getSelectedCustodiansLabel(custodians: number[]): string {
        if (!this.custodianChoices || !custodians || !custodians.length) {
            return '';
        }

        return this.custodianChoices.filter(c =>
            custodians.indexOf(c.value) > -1).map(c => c.label).reduce((a, b) => a + '; ' + b);
    }

    public saveProject() {
        this.project.geometry = this.featureMapComponent.getFeatureGeometry();

        if (this.project.id) {
            this.apiService.updateProject(this.project).subscribe(
                (project: Project) => this.project = project,
                (error: APIError) => console.log('error.msg', error.msg),
                () => this.isEditing = false
            );
        } else {
            this.apiService.createProject(this.project).subscribe(
                (project: Project) => {
                    this.project = project;
                    this.breadcrumbItems.pop();
                    this.breadcrumbItems.push({label: 'Edit ' + this.project.title});
                },
                (error: APIError) => console.log('error.msg', error.msg),
                () => this.isEditing = false
            );
        }
    }

    public editProject() {
        this.isEditing = true;
    }

    public confirmDeleteDataset(dataset:Dataset) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this dataset?',
            accept: () => {
                this.apiService.deleteDataset(dataset.id)
                    .subscribe(
                        () => this.onDeleteDatasetSuccess(dataset),
                        (error: APIError) => this.onDeleteDatasetError(error)
                    );
            }
        });
    }

    public confirmDeleteSite(site:Site) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this site?',
            accept: () => {
                this.apiService.deleteSite(site.id)
                    .subscribe(
                        () => this.onDeleteSiteSuccess(site),
                        (error: APIError) => this.onDeleteSiteError(error)
                    );
            }
        });
    }

    private onDeleteDatasetSuccess(dataset: Dataset) {
        for (let i = 0; i < this.datasets.length; i++) {
            if (this.datasets[i].id === dataset.id) {
                this.datasets.splice(i, 1);
                break;
            }
        }

        this.msgs.push({
            severity: 'success',
            summary: 'Dataset deleted',
            detail: 'The dataset was deleted'
        });
    }

    private onDeleteDatasetError(error: APIError) {
        this.msgs.push({
            severity: 'error',
            summary: 'Dataset delete error',
            detail: 'There were error(s) deleting the dataset: ' + error.msg
        });
    }

    private onDeleteSiteSuccess(site: Site) {
        for (let i = 0; i < this.sites.length; i++) {
            if (this.sites[i].id === site.id) {
                this.sites.splice(i, 1);
                break;
            }
        }

        this.msgs.push({
            severity: 'success',
            summary: 'Site deleted',
            detail: 'The site was deleted'
        });
    }

    private onDeleteSiteError(error: APIError) {
        this.msgs.push({
            severity: 'error',
            summary: 'Site delete error',
            detail: 'There were error(s) deleting the site: ' + error.msg
        });
    }
}

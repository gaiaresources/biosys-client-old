import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { APIService, APIError, User, Project, Site, Dataset, ModelChoice, FeatureMapComponent, MarkerDirective, DATASET_TYPE_MAP }
    from '../../../shared/index';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService, Message, SelectItem } from 'primeng/primeng';

@Component({
    moduleId: module.id,
    selector: 'biosys-edit-roject',
    templateUrl: 'edit-project.component.html',
})

export class EditProjectComponent implements OnInit {
    public static DEFAULT_TIMEZONE: string = 'Australia/Perth';

    private static COLUMN_WIDTH: number = 240;
    private static FIXED_COLUMNS_TOTAL_WIDTH = 700;

    @Input()
    set selectAllSites(selected: boolean) {
        this.isAllSitesSelected = selected;
        this.selectedSites = selected ? this.flatSites.map((site:Site) => site.id): [];
    }
    get selectAllSites(): boolean {
        return this.isAllSitesSelected;
    }

    @ViewChild(FeatureMapComponent)
    public featureMapComponent: FeatureMapComponent;

    public DATASET_TYPE_MAP: string = DATASET_TYPE_MAP;
    public selectedSites: number[] = [];
    public flatSites: any[];
    public siteAttributeKeys: string[] = [];
    public breadcrumbItems: any = [];
    public project: Project = <Project> {
        timezone: EditProjectComponent.DEFAULT_TIMEZONE,
        custodians: []
    };
    public datasets: Dataset[];
    public isEditing: boolean;
    public datamTypeChoices: SelectItem[];
    public custodianChoices: SelectItem[];
    public projectErrors: any = {};
    public messages: Message[] = [];

    private isAllSitesSelected: boolean = false;

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
                    this.breadcrumbItems.push({label: this.project.title});
                },
                (error: APIError) => console.log('error.msg', error.msg)
            );

            this.apiService.getAllDatasetsForProjectID(Number(params['id'])).subscribe(
                (datasets: Dataset[]) => this.datasets = datasets,
                (error: APIError) => console.log('error.msg', error.msg)
            );

            this.apiService.getAllSitesForProjectID(Number(params['id'])).subscribe(
                (sites: Site[]) => {
                    this.flatSites = this.formatFlatSites(sites);
                    this.siteAttributeKeys = sites.length > 0 ? this.extractSiteAttributeKeys(sites[0]) : [];
                },
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
            {label:'Manage - Projects', routerLink: ['/management/projects']},
        ];

        if (this.isEditing) {
            this.breadcrumbItems.push({label: 'Create Project'});

            // add self to selected custodians if creating project
            this.apiService.whoAmI().subscribe(
                (user: User) => this.project.custodians.push(user.id),
                (error: APIError) => console.log('error.msg', error.msg)
            );
        }

        if('siteSaved' in params) {
            this.messages.push({
                severity: 'success',
                summary: 'Site saved',
                detail: 'The site was saved'
            });
        } else if ('datasetSaved' in params) {
            this.messages.push({
                severity: 'success',
                summary: 'Dataset saved',
                detail: 'The dataset was saved'
            });
        } else if('siteDeleted' in params) {
            this.messages.push({
                severity: 'success',
                summary: 'Site deleted',
                detail: 'The site was deleted'
            });
        } else if('datasetDeleted' in params) {
            this.messages.push({
                severity: 'success',
                summary: 'Dataset deleted',
                detail: 'The dataset was deleted'
            });
        }
    }

    public getDatumLabel(value: string): string {
        if (!this.datamTypeChoices) {
            return '';
        }

        return this.datamTypeChoices.filter(d => d.value === value).pop().label;
    }

    public getSiteTableWidth(): any {
        if (this.siteAttributeKeys.length > 0) {
            return {'width': String(EditProjectComponent.FIXED_COLUMNS_TOTAL_WIDTH +
                (this.siteAttributeKeys.length * EditProjectComponent.COLUMN_WIDTH)) + 'px'};
        } else {
            return {width: '100%'};
        }
    }

    public formatSitePopup(site: Site): string {
        let popupContent: string = '<p class="m-0"><strong>' + (site.name ? site.name : site.code) + '</strong></p>';
        if (site.comments) {
            popupContent += '<p class="mt-1">' + site.comments + '</p>';
        }

        let projId = this.project.id ? this.project.id : Number(this.route.snapshot.params['id']);

        if (projId) {
            popupContent += '<p class="mt-1"><a href="#/management/projects/edit-project/' + projId + '/edit-site/' +
                site.id + '">Edit Site</a></p>';
        }

        return popupContent;
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
                (project: Project) => {
                    this.project = project;
                    this.projectErrors = {};
                    this.isEditing = false;
                },
                (errors: APIError) => this.projectErrors = errors.text,
            );
        } else {
            this.apiService.createProject(this.project).subscribe(
                (project: Project) => {
                    this.project = project;
                    this.breadcrumbItems.pop();
                    this.breadcrumbItems.push({label: 'Edit ' + this.project.title});
                    this.projectErrors = {};
                    this.isEditing = false;
                },
                (errors: APIError) => this.projectErrors = errors.text
            );
        }
    }

    public editProject() {
        this.isEditing = true;
    }

    public cancelEditProject() {
        this.apiService.getProjectById(this.project.id).subscribe(
            (project: Project) => this.project = project,
            (error: APIError) => console.log('error.msg', error.msg)
        );

        this.isEditing = false;
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

    public confirmDeleteSelectedSites(site:Site) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete all selected sites?',
            accept: () => {
                this.apiService.deleteSites(this.project.id, this.selectedSites)
                .subscribe(
                    () => this.onDeleteSitesSuccess(),
                    (error: APIError) => this.onDeleteSiteError(error)
                );
            }
        });
    }

    private onDeleteDatasetSuccess(dataset: Dataset) {
        this.apiService.getAllDatasetsForProjectID(this.project.id).subscribe(
            (datasets: Dataset[]) => this.datasets = datasets,
            (error: APIError) => console.log('error.msg', error.msg)
        );

        this.messages.push({
            severity: 'success',
            summary: 'Dataset deleted',
            detail: 'The dataset was deleted'
        });
    }

    private onDeleteDatasetError(error: APIError) {
        this.messages.push({
            severity: 'error',
            summary: 'Dataset delete error',
            detail: 'There were error(s) deleting the dataset: ' + error.msg
        });
    }

    private extractSiteAttributeKeys(site: Site): string[] {
        // For now just use attributes for first site in array as all sites *should* have the same
        // attributes. In future use site schema associated with project.
        return site ? Object.keys(site.attributes) : [];
    }

    private formatFlatSites(sites: Site[]): any[] {
        return sites.map((s:Site) => Object.assign({
            id: s.id,
            code: s.code,
            name: s.name,
            comments: s.comments,
            centroid: s.centroid
        }, s.attributes));
    }

    private onDeleteSitesSuccess() {
        this.flatSites = [];

        this.apiService.getAllSitesForProjectID(this.project.id).subscribe(
            (sites: Site[]) => {
                this.flatSites = this.formatFlatSites(sites);
                this.siteAttributeKeys = sites.length > 0 ? this.extractSiteAttributeKeys(sites[0]) : [];
            },
            (error: APIError) => console.log('error.msg', error.msg)
        );

        this.messages.push({
            severity: 'success',
            summary: 'Site(s) deleted',
            detail: 'The site(s) was deleted'
        });
    }

    private onDeleteSiteError(error: APIError) {
        this.messages.push({
            severity: 'error',
            summary: 'Site delete error',
            detail: 'There were error(s) deleting the site(s): ' + error.msg
        });
    }
}

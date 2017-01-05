import { Component, OnInit, ViewChild } from '@angular/core';
import {
    APIService,
    APIError,
    User,
    Project,
    Site,
    Dataset,
    ModelChoice,
    FeatureMapComponent
} from '../../../shared/index';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/primeng';

@Component({
    moduleId: module.id,
    selector: 'biosys-edit-roject',
    templateUrl: 'edit-project.component.html',
    styleUrls: [],
})

export class EditProjectComponent implements OnInit {
    @ViewChild(FeatureMapComponent)
    public featureMapComponent: FeatureMapComponent;

    public project: Project = <Project>{};
    public sites: Site[];
    public datasets: Dataset[];

    public isEditing: boolean;

    public datamTypeChoices: SelectItem[];
    public custodianChoices: SelectItem[];

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

        return this.custodianChoices.filter(c => custodians.indexOf(c.value) > -1).map(c => c.label).reduce((a, b) => a + '; ' + b);
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
                (project: Project) => this.project = project,
                (error: APIError) => console.log('error.msg', error.msg),
                () => this.isEditing = false
            );
        }
    }

    public editProject() {
        this.isEditing = true;
    }
}

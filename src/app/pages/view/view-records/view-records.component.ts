import { Component, OnInit } from '@angular/core';
import { APIService, APIError, Project, Dataset } from '../../../shared/index';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/primeng';

@Component({
    moduleId: module.id,
    selector: 'biosys-data-project-list',
    templateUrl: 'view-records.component.html',
    styleUrls: [],
})

export class ViewRecordsComponent implements OnInit {
    public breadcrumbItems: any = [];
    public datasets: Dataset[] = [];
    public projectDropdownItems: SelectItem[] = [{label: 'Select Project', value: null}];
    public speciesDropdownItems: SelectItem[] = [{label: 'Select Species', value: null}];

    public projectId: number;
    public dateStart: Date;
    public dateEnd: Date;
    public speciesNameId: number;

    constructor(private apiService: APIService, private router: Router) {
    }

    ngOnInit() {
        this.apiService.getProjects().subscribe(
            (projects: Project[]) => this.projectDropdownItems = this.projectDropdownItems.concat(
                projects.map(project => ({
                    'label': project.title,
                    'value': project.id
                }))
            ),
            (error: APIError) => console.log('error.msg', error.msg)
        );

        this.apiService.getSpecies().subscribe(
            (species: any) => this.speciesDropdownItems = this.speciesDropdownItems.concat(
                Object.keys(species).map(speciesKey => ({
                    'label': speciesKey,
                    'value': species[speciesKey]
                }))
            ),
            (error: APIError) => console.log('error.msg', error.msg)
        );

        this.breadcrumbItems = [
            {label: 'View and export records'},
        ];
    }

    public search() {
        let params: any = {};

        if (this.projectId) {
            params['project'] = this.projectId;
        }

        if (this.dateStart) {
            params['record__datetime__start'] = this.dateStart.toISOString();
        }

        if (this.dateEnd) {
            params['record__datetime__end'] = this.dateEnd.toISOString();
        }

        if (this.speciesNameId) {
            params['record__name_id'] = this.speciesNameId;
        }

        this.apiService.getDatasets(params).subscribe(
            (datasets: Dataset[]) => this.datasets = datasets,
            (error: APIError) => console.log('error.msg', error.msg)
        );
    }

    public exportRecords(dataset: Dataset) {
        this.apiService.exportRecords(dataset.id).subscribe(
            (species: any) => {},
            (error: APIError) => console.log('error.msg', error.msg)
        );
    }
}

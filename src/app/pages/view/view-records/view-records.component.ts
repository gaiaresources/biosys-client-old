import { Component, OnInit } from '@angular/core';
import { APIService, APIError, Project, Dataset, Record, DATASET_TYPE_MAP } from '../../../shared/index';
import { Router } from '@angular/router';
import { SelectItem, AutoComplete } from 'primeng/primeng';

@Component({
    moduleId: module.id,
    selector: 'biosys-data-project-list',
    templateUrl: 'view-records.component.html',
    styleUrls: ['view-records.component.css'],
})

export class ViewRecordsComponent implements OnInit {
    private static COLUMN_WIDTH: number = 240;

    public DATASET_TYPE_MAP: string = DATASET_TYPE_MAP;
    public breadcrumbItems: any = [];
    public projectDropdownItems: SelectItem[] = [{label: 'Select Project', value: null}];
    public projectsMap: any = {};
    public speciesDropdownItems: SelectItem[] = [{label: 'Select Species', value: null}];

    public datasets: Dataset[];
    public records: Record[];

    public selectedDataset: Dataset;

    public projectId: number;
    public dateStart: Date;
    public dateEnd: Date;
    public speciesName: string;

    public exportURL: string;

    constructor(private apiService: APIService, private router: Router) {
    }

    ngOnInit() {
        this.apiService.getProjects().subscribe(
            (projects: Project[]) => {
                this.projectDropdownItems = this.projectDropdownItems.concat(
                    projects.map(project => ({
                        'label': project.title,
                        'value': project.id
                    }))
                );

                projects.forEach(project => this.projectsMap[project.id] = project.title);
            },
            (error: APIError) => console.log('error.msg', error.msg)
        );

        this.apiService.getSpecies().subscribe(
            (species: string[]) => this.speciesDropdownItems =
                this.speciesDropdownItems.concat(species.map(s => ({'label': s, 'value': s}))),
            (error: APIError) => console.log('error.msg', error.msg)
        );

        this.apiService.getDatasets().subscribe(
            (datasets: Dataset[]) => this.datasets = datasets,
            (error: APIError) => console.log('error.msg', error.msg)
        );

        this.breadcrumbItems = [
            {label: 'View and Export Records'},
        ];
    }

    public filter() {
        this.records = null;

        let datasetParams: any = {};
        let recordParams: any = {};

        if (this.projectId) {
            datasetParams['project'] = this.projectId;
        }

        if (this.dateStart) {
            datasetParams['record__datetime__start'] = recordParams['datetime__start'] = this.dateStart.toISOString();
        }

        if (this.dateEnd) {
            datasetParams['record__datetime__end'] = recordParams['datetime__end'] = this.dateEnd.toISOString();
        }

        if (this.speciesName) {
            datasetParams['record__species_name'] = recordParams['species_name'] = this.speciesName;
        }

        this.apiService.getDatasets(datasetParams).subscribe(
            (datasets: Dataset[]) => this.datasets = datasets,
            (error: APIError) => console.log('error.msg', error.msg)
        );

        if(this.selectedDataset) {
            recordParams['dataset__id'] = this.selectedDataset.id;
            this.apiService.getRecords(recordParams).subscribe(
                (records: Record[]) => this.records = records,
                (error: APIError) => console.log('error.msg', error.msg)
            );
        }

        this.exportURL = this.apiService.getRecordExportURL() +
            Object.keys(recordParams).reduce(function(left, right) {
                left.push(right + '=' + encodeURIComponent(recordParams[right]));
                return left;
            },[]).join('&');
    }

    public selectDataset(event: any) {
        this.filter();
    }

    public reset() {
        this.projectId = null;
        this.dateStart = null;
        this.dateEnd = null;
        this.speciesName = null;

        this.filter();
    }

    public getDataTableWidth(): any {
        if(!this.selectedDataset) {
            return { width: '100%'};
        }

        // need to do the following to prevent linting error
        let data_package:any = this.selectedDataset.data_package;
        let resources:any = data_package['resources'];

        if (resources[0].schema.fields.length > 3) {
            return {'width': String(resources[0].schema.fields.length * ViewRecordsComponent.COLUMN_WIDTH) + 'px'};
        } else {
            return { width: '100%'};
        }
    }
}

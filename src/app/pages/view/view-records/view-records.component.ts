import { Component, OnInit } from '@angular/core';
import { APIService, APIError, Project, Dataset, Record } from '../../../shared/index';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/primeng';

@Component({
    moduleId: module.id,
    selector: 'biosys-data-project-list',
    templateUrl: 'view-records.component.html',
    styleUrls: ['view-records.component.css'],
})

export class ViewRecordsComponent implements OnInit {
    private static COLUMN_WIDTH: number = 240;

    public breadcrumbItems: any = [];
    public datasets: Dataset[];
    public records: Record[];

    public selectedDataset: Dataset;

    public projectsMap: any = {};
    public projectDropdownItems: SelectItem[] = [{label: 'All Projects', value: null}];
    public speciesDropdownItems: SelectItem[] = [{label: 'All Species', value: null}];

    public projectId: number;
    public dateStart: Date;
    public dateEnd: Date;
    public speciesNameId: number;

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

        this.apiService.getAllDatasets().subscribe(
            (datasets: Dataset[]) => this.datasets = datasets,
            (error: APIError) => console.log('error.msg', error.msg)
        );

        // this.apiService.getSpecies().subscribe(
        //     (species: any) => this.speciesDropdownItems = this.speciesDropdownItems.concat(
        //         Object.keys(species).map(speciesKey => ({
        //             'label': speciesKey,
        //             'value': species[speciesKey]
        //         }))
        //     ),
        //     (error: APIError) => console.log('error.msg', error.msg)
        // );

        this.breadcrumbItems = [
            {label: 'View and export records'},
        ];
    }

    public filter() {
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

        if(this.selectedDataset) {
            delete params['project'];
            params['dataset__id'] = this.selectedDataset.id;
            this.apiService.getRecords(params).subscribe(
                (records: Record[]) => this.records = records,
                (error: APIError) => console.log('error.msg', error.msg)
            );
        }

        this.exportURL = 'http://localhost:8000/api/records/?' +
            Object.keys(params).reduce(function(a,k){a.push(k+'='+encodeURIComponent(params[k]));return a;},[]).join('&');
    }

    public selectDataset(event: any) {
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

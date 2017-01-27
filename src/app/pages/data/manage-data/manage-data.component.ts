import { Component, OnInit } from '@angular/core';
import { APIService, APIError, Dataset, GenericRecord } from '../../../shared/index';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'biosys-data-dataset-list',
    templateUrl: 'manage-data.component.html',
    styleUrls: ['manage-data.component.css'],
})

export class ManageDataComponent implements OnInit {
    private static COLUMN_WIDTH:number = 240;

    public dataset: Dataset = <Dataset>{};
    public data: GenericRecord[] = [];

    constructor(private apiService: APIService, private router: Router, private route: ActivatedRoute) {
    }

    ngOnInit() {
        let params = this.route.snapshot.params;
        if ('datasetId' in params) {
            let datasetId:Number = Number(params['datasetId']);

            this.apiService.getDatasetById(datasetId)
                .subscribe(
                    (dataset: Dataset) => this.dataset = dataset,
                    (error: APIError) => console.log('error.msg', error.msg)
                );

            this.apiService.getDataByDatasetId(datasetId)
                .subscribe(
                    (data: any[]) => this.data = data,
                    (error: APIError) => console.log('error.msg', error.msg)
                );
        }
    }

    onRowSelect(event:any) {

    }

    getDataTableWidth(): any {
        if(!('data_package' in this.dataset)) {
            return {
                width: '100%'
            };
        }

        // need to do the following to prevent linting error
        let data_package:any = this.dataset.data_package;
        let resources:any = data_package['resources'];

        return {
            'width': String(resources[0].schema.fields.length * ManageDataComponent.COLUMN_WIDTH) + 'px'
        };
    }
}

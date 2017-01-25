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
                    (dataset: Dataset) => {
                        this.dataset = dataset;
                        console.log(this.dataset);
                    },
                            (error: APIError) => console.log('error.msg', error.msg)
                );

            this.apiService.getDataByDatasetId(datasetId)
                .subscribe(
                    (data: any[]) => {
                        this.data = data;
                        console.log(this.data);
                    }, (error: APIError) => console.log('error.msg', error.msg)
                );
        }
    }

    onRowSelect(event:any) {

    }
}

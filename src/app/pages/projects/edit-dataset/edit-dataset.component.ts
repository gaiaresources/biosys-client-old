import { Component, OnInit } from '@angular/core';
import { APIService, APIError, Dataset } from '../../../shared/index';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'bios-edit-dataset',
    templateUrl: 'edit-dataset.component.html',
    styleUrls: [],
})

export class EditDatasetComponent implements OnInit {
    private ds: Dataset = <Dataset>{};

    constructor(
        private apiService: APIService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        console.log('fetch dataset id', this.route.snapshot);
        let params = this.route.snapshot.params;
        if ('id' in params) {
            this.apiService.getDatasetById(Number(params['id'])).subscribe(
                (ds: Dataset) => this.ds = ds,
                (error: APIError) => console.log('error.msg', error.msg)
            );
        } else if ('projId' in params) {
            console.log('Create Dataset');
            this.ds.project = Number(params['projId'])
        } else {
            throw new Error("No project ID provided")
        }
    }

    save() {
        console.log('save', this.ds);
        if(this.ds.id) {
            this.apiService.updateDataset(this.ds).subscribe(
                () => this.router.navigate(['/projects']),
                (error: APIError) => console.log('error.msg', error.msg)
            );
        } else {
            this.apiService.createDataset(this.ds).subscribe(
                () => this.router.navigate(['/projects']),
                (error: APIError) => console.log('error.msg', error.msg)
            );
        }

    }
}

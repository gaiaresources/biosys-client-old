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

    constructor(private apiService: APIService, private router: Router, private route: ActivatedRoute) {

    }

    ngOnInit() {
        console.log('Edit ds');
        if ('id' in this.route.snapshot.params) {
            console.log('fetch dataset id', this.route.snapshot.params['id']);
            // this.apiService.getProjectById(Number(this.route.snapshot.params['id'])).subscribe(
            //     (project: Project) => this.project = project,
            //     (error: APIError) => console.log('error.msg', error.msg)
            // );
        }
    }

    edit(ds: Dataset) {
        this.router.navigate(['/edit-dataset/edit-dataset/' + ds.id]);
    }
}

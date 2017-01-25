import { Component, OnInit } from '@angular/core';
import { APIService, APIError, Project, Dataset } from '../../../shared/index';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'biosys-data-dataset-list',
    templateUrl: 'list-datasets.component.html',
    styleUrls: [],
})

export class ListDatasetsComponent implements OnInit {
    public project: Project;
    public datasets: Dataset[] = [];

    constructor(private apiService: APIService, private router: Router, private route: ActivatedRoute) {
    }

    ngOnInit() {
        let params = this.route.snapshot.params;
        if ('projId' in params) {
            let projId:Number = Number(params['projId']);

            this.apiService.getProjectById(projId)
                .subscribe(
                    (project: Project) => this.project = project,
                    (error: APIError) => console.log('error.msg', error.msg)
                );

            this.apiService.getAllDatasetsForProjectID(projId)
                .subscribe(
                    (datasets: Dataset[]) => this.datasets = datasets,
                    (error: APIError) => console.log('error.msg', error.msg)
                );
        }
    }

    onRowSelect(event:any) {
        this.router.navigate(['/data/projects/' + this.project.id + '/datasets/' + event.data.id]);
    }
}

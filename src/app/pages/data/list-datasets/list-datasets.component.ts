import { Component, OnInit } from '@angular/core';
import { APIService, APIError, Project, Dataset, DATASET_TYPE_MAP } from '../../../shared/index';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'biosys-data-dataset-list',
    templateUrl: 'list-datasets.component.html',
    styleUrls: [],
})

export class ListDatasetsComponent implements OnInit {
    public DATASET_TYPE_MAP: string = DATASET_TYPE_MAP;

    public breadcrumbItems: any = [];
    public project: Project;
    public datasets: Dataset[] = [];

    constructor(private apiService: APIService, private router: Router, private route: ActivatedRoute) {
    }

    ngOnInit() {
        let params = this.route.snapshot.params;

        let projId: number = Number(params['projId']);

        this.apiService.getProjectById(projId)
            .subscribe(
                (project: Project) => {
                    this.project = project;
                    this.breadcrumbItems.push({label: 'Datasets for ' + this.project.title});
                },
                (error: APIError) => console.log('error.msg', error.msg)
            );

        this.apiService.getAllDatasetsForProjectID(projId)
            .subscribe(
                (datasets: Dataset[]) => this.datasets = datasets,
                (error: APIError) => console.log('error.msg', error.msg)
            );

        this.breadcrumbItems = [
            {label: 'Enter Data - Project List', routerLink: ['/data/projects']},
        ];
    }
}

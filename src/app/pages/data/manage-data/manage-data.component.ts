import { Component, OnInit, ViewChild } from '@angular/core';
import { APIService, APIError, Project, Dataset, Record } from '../../../shared/index';
import { Router, ActivatedRoute } from '@angular/router';
import { Message, FileUpload } from 'primeng/primeng';

@Component({
    moduleId: module.id,
    selector: 'biosys-data-dataset-list',
    templateUrl: 'manage-data.component.html',
    styleUrls: ['manage-data.component.css'],
})

export class ManageDataComponent implements OnInit {
    private static COLUMN_WIDTH: number = 240;
    private static ACCEPTED_TYPES: string[] = [
        'text/csv',
        'text/comma-separated-values',
        'application/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/vnd.msexcel'
    ];

    public breadcrumbItems: any = [];
    public dataset: Dataset = <Dataset>{};
    public records: Record[] = [];
    public recordErrors: any = {};
    public tablePlaceholder: string = 'Loading Records';
    public messages: Message[] = [];
    public uploadURL: string;
    public uploadCreateSites: boolean = true;
    public uploadDeleteExistingRecords: boolean = false;
    public uploadErrorMessages: Message[] = [];
    public uploadWarningMessages: Message[] = [];

    @ViewChild(FileUpload)
    public uploader: FileUpload;

    constructor(private apiService: APIService, private router: Router, private route: ActivatedRoute) {
    }

    public ngOnInit() {
        let params = this.route.snapshot.params;

        let projId: number = Number(params['projId']);
        let datasetId: number = Number(params['datasetId']);

        this.apiService.getProjectById(projId)
            .subscribe(
                (project: Project) => this.breadcrumbItems.splice(1, 0, {
                    label: 'Datasets for ' + project.title,
                    routerLink: ['/data/projects/' + projId + '/datasets']
                }),
                (error: APIError) => console.log('error.msg', error.msg)
            );

        this.apiService.getDatasetById(datasetId)
            .subscribe(
                (dataset: Dataset) => {
                    this.dataset = dataset;
                    this.breadcrumbItems.push({label: 'Records for ' + this.dataset.name});
                },
                (error: APIError) => console.log('error.msg', error.msg)
            );

        this.apiService.getDataByDatasetId(datasetId)
            .subscribe(
                (data: any[]) => this.records = data,
                (error: APIError) => console.log('error.msg', error.msg),
                () => this.tablePlaceholder = 'No records found'
            );

        this.uploadURL = this.apiService.getRecordsUploadURL(datasetId);

        this.breadcrumbItems = [
            {label:'Enter Records - Project List', routerLink: '/data/projects'}
        ];

        if('recordSaved' in params) {
            this.messages.push({
                severity: 'success',
                summary: 'Record saved',
                detail: 'The record was saved'
            });
        } else if ('recordDeleted' in params) {
            this.messages.push({
                severity: 'success',
                summary: 'Record deleted',
                detail: 'The record was deleted'
            });
        }
    }

    public getDataTableWidth(): any {
        if(!('data_package' in this.dataset)) {
            return { width: '100%'};
        }

        // need to do the following to prevent linting error
        let data_package:any = this.dataset.data_package;
        let resources:any = data_package['resources'];

        if (resources[0].schema.fields.length > 3) {
            return {'width': String(resources[0].schema.fields.length * ManageDataComponent.COLUMN_WIDTH) + 'px'};
        } else {
            return { width: '100%'};
        }
    }

    public onRowSelect(event:any) {
        let params = this.route.snapshot.params;

        let projId: number = Number(params['projId']);
        let datasetId: number = Number(params['datasetId']);

        this.router.navigate(['/data/projects/' + projId + '/datasets/' + datasetId + '/record/' + event.data.id]);
    }

    public add() {
        let params = this.route.snapshot.params;

        let projId: number = Number(params['projId']);
        let datasetId: number = Number(params['datasetId']);

        this.router.navigate(['/data/projects/' + projId + '/datasets/' + datasetId + '/create-record/']);
    }

    public onUpload(event: any) {
        this.messages.push({
            severity: 'success',
            summary: 'Upload successful',
            detail: 'The records were successfully uploaded'
        });

        this.apiService.getDataByDatasetId(this.dataset.id)
            .subscribe(
                (data: any[]) => this.records = data,
                (error: APIError) => console.log('error.msg', error.msg),
                () => this.tablePlaceholder = 'No records found'
            );
    }

    public onBeforeUpload(event: any) {
        event.formData.append('create_site', this.uploadCreateSites);
        event.formData.append('delete_previous', this.uploadDeleteExistingRecords);
    }

    public onUploadError(event: any) {
        this.uploadErrorMessages = [];
        this.uploadWarningMessages = [];
        let statusCode = event.xhr.status;
        let resp = event.xhr.response;
        if (statusCode === 400) {
            resp = JSON.parse(resp);

            for (let item of resp) {
                if('errors' in item) {
                    for (let errorKey in item['errors']) {
                        this.uploadErrorMessages.push({
                            severity: 'error',
                            summary: 'Error for ' + errorKey + ' in row ' + item['row'],
                            detail: item['errors'][errorKey]
                        });
                    }
                }

                if('warnings' in item) {
                    for (let warningKey in item['warnings']) {
                        this.uploadWarningMessages.push({
                            severity: 'warn',
                            summary: 'Warning for ' + warningKey + ' in row ' + item['row'],
                            detail: item['warnings'][warningKey]
                        });
                    }
                }
            }
        } else {
            this.uploadErrorMessages.push({
                severity: 'error',
                summary: 'Error',
                detail: statusCode + ':' + resp
            });
        }

        this.messages.push({
            severity: 'error',
            summary: 'Error uploading records',
            detail: 'There were one or more errors uploading the records file'
        });
    }

    public onUploadBeforeSend(event: any) {
        let xhr = event.xhr;
        for (let header of this.apiService.getAuthHeaders()) {
            xhr.setRequestHeader(header[0], header[1]);
        }
    }

    public onUploadSelect(event: any) {
        this.uploadErrorMessages = [];
        this.uploadWarningMessages = [];

        // check file type (the last in the list)
        // use the file list of uploader instead of the file list given in the event so we can add/remove to it.
        let files: File[] = this.uploader.files;
        let file: File = files.pop();
        if (ManageDataComponent.ACCEPTED_TYPES.indexOf(file.type) === -1) {
            this.uploadErrorMessages.push({
                severity: 'error',
                summary: 'Wrong file type',
                detail: 'It must be an Excel (.xlsx) or a csv file.'
            });
        } else {
            // put back the file in the list
            files.push(file);
        }
    }
}

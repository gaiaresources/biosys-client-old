import { Component, OnInit, ViewChild, AfterContentInit, AfterViewInit } from '@angular/core';
import { APIService, APIError, Project, Dataset, Record } from '../../../shared/index';
import { Router, ActivatedRoute } from '@angular/router';
import { Message, FileUpload } from 'primeng/primeng';

@Component({
    moduleId: module.id,
    selector: 'biosys-data-dataset-list',
    templateUrl: 'manage-data.component.html',
    styleUrls: ['manage-data.component.css'],
})

export class ManageDataComponent implements OnInit, AfterViewInit {
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
    public projId: number;
    public datasetId: number;
    public dataset: Dataset = <Dataset>{};
    public flatRecords: any[] = [];
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

    private uploadButton: any;

    constructor(private apiService: APIService, private router: Router, private route: ActivatedRoute) {
    }

    public ngOnInit() {
        let params = this.route.snapshot.params;

        this.projId = Number(params['projId']);
        this.datasetId = Number(params['datasetId']);

        this.apiService.getProjectById(this.projId)
            .subscribe(
                (project: Project) => this.breadcrumbItems.splice(1, 0, {
                    label: 'Datasets for ' + project.title,
                    routerLink: ['/data/projects/' + this.projId + '/datasets']
                }),
                (error: APIError) => console.log('error.msg', error.msg)
            );

        this.apiService.getDatasetById(this.datasetId)
            .subscribe(
                (dataset: Dataset) => {
                    this.dataset = dataset;
                    this.breadcrumbItems.push({label: 'Records for ' + this.dataset.name});
                },
                (error: APIError) => console.log('error.msg', error.msg)
            );

        this.apiService.getDataByDatasetId(this.datasetId)
            .subscribe(
                (data: any[]) => this.flatRecords = data.map((r:Record) => Object.assign({id: r.id}, r.data)),
                (error: APIError) => console.log('error.msg', error.msg),
                () => this.tablePlaceholder = 'No records found'
            );

        this.uploadURL = this.apiService.getRecordsUploadURL(this.datasetId);

        this.breadcrumbItems = [
            {label:'Enter Records - Project List', routerLink: '/data/projects'}
        ];

        if ('recordSaved' in params) {
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
    public ngAfterViewInit() {
        // TODO: find a better way to access the upload button.
        this.uploadButton = document.querySelector('p-fileupload button[icon="fa-upload"]');
    }
    public getDataTableWidth(): any {
        if (!('data_package' in this.dataset)) {
            return {width: '100%'};
        }

        // need to do the following to prevent linting error
        let data_package: any = this.dataset.data_package;
        let resources: any = data_package['resources'];

        if (resources[0].schema.fields.length > 3) {
            return {'width': String(resources[0].schema.fields.length * ManageDataComponent.COLUMN_WIDTH) + 'px'};
        } else {
            return {width: '100%'};
        }
    }

    public add() {
        this.router.navigate(['/data/projects/' + this.projId + '/datasets/' + this.datasetId + '/create-record/']);
    }

    public onUpload(event: any) {
        this.parseAndDisplayResponse(event.xhr.response);
        this.apiService.getDataByDatasetId(this.dataset.id)
            .subscribe(
                (data: any[]) => this.flatRecords = data.map((r:Record) => Object.assign({id: r.id}, r.data)),
                (error: APIError) => console.log('error.msg', error.msg),
                () => this.tablePlaceholder = 'No records found'
            );
    }

    public onBeforeUpload(event: any) {
        this.uploadButton.disabled = true;
        event.formData.append('create_site', this.uploadCreateSites);
        event.formData.append('delete_previous', this.uploadDeleteExistingRecords);
    }

    public onUploadError(event: any) {
        let statusCode = event.xhr.status;
        let resp = event.xhr.response;
        if (statusCode === 400) {
            this.parseAndDisplayResponse(resp);
        } else {
            this.uploadErrorMessages = [];
            this.uploadErrorMessages.push({
                severity: 'error',
                summary: 'Error',
                detail: statusCode + ':' + resp
            });
        }
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

    private parseAndDisplayResponse(resp: any) {
        let items = resp ? JSON.parse(resp) : [];
        let totalRecords = items.length,
            totalErrors = 0,
            totalWarnings = 0;
        this.messages = [];
        this.uploadErrorMessages = [];
        this.uploadWarningMessages = [];
        for (let item of items) {
            if ('errors' in item) {
                for (let errorKey in item['errors']) {
                    totalErrors += 1;
                    this.uploadErrorMessages.push({
                        severity: 'error',
                        summary: 'Error for ' + errorKey + ' in row ' + item['row'],
                        detail: item['errors'][errorKey]
                    });
                }
            }
            if ('warnings' in item) {
                for (let warningKey in item['warnings']) {
                    totalWarnings += 1;
                    this.uploadWarningMessages.push({
                        severity: 'warn',
                        summary: 'Warning for ' + warningKey + ' in row ' + item['row'],
                        detail: item['warnings'][warningKey]
                    });
                }
            }
        }
        if (totalErrors > 0) {
            this.messages.push({
                severity: 'error',
                summary: 'Error uploading records',
                detail: 'There were ' + totalErrors + ' error(s) uploading the records file. See details below.'
            });
        } else if (totalWarnings > 0) {
            this.messages.push({
                severity: 'warn',
                summary: 'Records uploaded with some warnings',
                detail: 'The records were accepted but there were ' + totalWarnings + ' warning(s). See details below.'
            });
        } else {
            console.log('success');
            this.messages.push({
                severity: 'success',
                summary: 'Upload successful',
                detail: '' + totalRecords + ' records were successfully uploaded'
            });
        }
    }
}

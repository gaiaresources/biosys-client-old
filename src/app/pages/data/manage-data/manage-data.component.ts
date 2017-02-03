import { Component, OnInit, ViewChild } from '@angular/core';
import { APIService, APIError, Project, Dataset, GenericRecord, Observation, SpeciesObservation } from '../../../shared/index';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService, Message, SelectItem, FileUpload } from 'primeng/primeng';
import * as moment from 'moment/moment';

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
    private static AMBIGOUS_DATE_PATTERN: RegExp = /^(\d{1,2}).(\d{1,2}).(\d{4})$/;

    public breadcrumbItems: any = [];
    public dataset: Dataset = <Dataset>{};
    public records: GenericRecord[] = [];
    public selectedRecord: GenericRecord = null;
    public recordErrors: any = {};
    public showEditDialog: boolean = false;
    public tablePlaceholder: string = 'Loading Records';
    public messages: Message[] = [];
    public dropdownItems: any = {};
    public uploadURL: string;
    public uploadCreateSites: boolean = true;
    public uploadDeleteExistingRecords: boolean = false;
    public uploadErrorMessages: Message[] = [];
    public uploadWarningMessages: Message[] = [];

    @ViewChild(FileUpload)
    public uploader: FileUpload;

    constructor(private apiService: APIService, private router: Router, private route: ActivatedRoute,
                private confirmationService: ConfirmationService) {
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
            {label:'Enter Records - Project List', url: '#/data/projects'}
        ];
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
        // use JSON operations to make deep copy of datum
        this.selectedRecord = JSON.parse(JSON.stringify(event.data));

        // convert date fields to Date type because calendar element in form expects a Date
        for(let field of this.dataset.data_package.resources[0].schema.fields) {
            if(field.type === 'date') {
                // If date in DD?MM?YYYY format (where ? is any single char), convert to American (as Chrome, Firefox
                // and IE expect this when creating Date from a string
                let dateString:string = this.selectedRecord.data[field.name];
                let regexGroup: string[] = dateString.match(ManageDataComponent.AMBIGOUS_DATE_PATTERN);
                if(regexGroup) {
                    dateString = regexGroup[2] + '/' + regexGroup[1] + '/' + regexGroup[3];
                }
                this.selectedRecord.data[field.name] = new Date(dateString);
            }
        }

        this.showEditDialog = true;
    }

    public getDropdownOptions(fieldName: string, options: string[]): SelectItem[] {
        if(!(fieldName in this.dropdownItems)) {
            this.dropdownItems[fieldName] = options.map(option => ({'label': option, 'value': option}));
        }

        return this.dropdownItems[fieldName];
    }

    public save(event:any) {
        // need to use a copy because there may be Date objects within this.selectedRecord which are bound
        // to calendar elements which must remain dates
        let selectedRecordCopy = JSON.parse(JSON.stringify(this.selectedRecord));

        // convert Date types back to string in DD/MM/YYYY format
        for(let field of this.dataset.data_package.resources[0].schema.fields) {
            if(field.type === 'date') {
                selectedRecordCopy.data[field.name] = moment(selectedRecordCopy.data[field.name]).format('DD/MM/YYYY');
            }
        }

        if (this.dataset.type === 'generic') {
            if('id' in selectedRecordCopy) {
                this.apiService.updateGenericRecord(selectedRecordCopy.id, selectedRecordCopy)
                    .subscribe(
                        (genericRecord: GenericRecord) => this.onSaveSuccess(genericRecord, false),
                        (error: APIError) => this.onSaveError(error)
                    );
            } else {
                this.apiService.createGenericRecord(selectedRecordCopy)
                    .subscribe(
                        (genericRecord: GenericRecord) => this.onSaveSuccess(genericRecord, true),
                        (error: APIError) => this.onSaveError(error)
                    );
            }
        } else if (this.dataset.type === 'observation') {
            if('id' in selectedRecordCopy) {
                this.apiService.updateObservation(selectedRecordCopy.id, selectedRecordCopy)
                    .subscribe(
                        (observation: Observation) => this.onSaveSuccess(observation, false),
                        (error: APIError) => this.onSaveError(error)
                    );
            } else {
                this.apiService.createObservation(selectedRecordCopy)
                    .subscribe(
                        (observation: Observation) => this.onSaveSuccess(observation, true),
                        (error: APIError) => this.onSaveError(error)
                    );
            }
        } else if (this.dataset.type === 'species_observation') {
            if('id' in selectedRecordCopy) {
                this.apiService.updateSpeciesObservation(selectedRecordCopy.id, selectedRecordCopy)
                    .subscribe(
                        (speciesObservation: SpeciesObservation) => this.onSaveSuccess(speciesObservation, false),
                        (error: APIError) => this.onSaveError(error)
                    );
            } else {
                this.apiService.createSpeciesObservation(selectedRecordCopy)
                    .subscribe(
                        (speciesObservation: SpeciesObservation) => this.onSaveSuccess(speciesObservation, true),
                        (error: APIError) => this.onSaveError(error)
                    );
            }
        } else {
            console.error('dateset type not found');
        }
    }

    public add() {
        let data: any = {};
        for(let datum of this.dataset.data_package.resources[0].schema.fields) {
            data[datum['name']] = '';
        }

        this.selectedRecord = {
            dataset: this.dataset.id,
            data: data
        };

        this.showEditDialog = true;
    }

    public confirmDelete(event:any) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this record?',
            accept: () => {
                if (this.dataset.type === 'generic') {
                    this.apiService.deleteGenericRecord(this.selectedRecord.id)
                        .subscribe(
                            (genericRecord: GenericRecord) => this.onDeleteSuccess(this.selectedRecord),
                            (error: APIError) => this.onDeleteError(error)
                        );
                } else if (this.dataset.type === 'observation') {
                    this.apiService.deleteObservation(this.selectedRecord.id)
                        .subscribe(
                            (observation: Observation) => this.onDeleteSuccess(this.selectedRecord),
                            (error: APIError) => this.onDeleteError(error)
                        );
                } else if (this.dataset.type === 'species_observation') {
                    this.apiService.deleteSpeciesObservation(this.selectedRecord.id)
                        .subscribe(
                            (speciesObservation: SpeciesObservation) => this.onDeleteSuccess(this.selectedRecord),
                            (error: APIError) => this.onDeleteError(error)
                        );
                } else {
                    console.error('dateset type not found');
                }
            }
        });
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

    private onSaveSuccess(genericRecord: GenericRecord, isNew:boolean) {
        if(isNew) {
            this.records.push(genericRecord);
        } else {
            for (let i = 0; i < this.records.length; i++) {
                if (this.records[i].id === genericRecord.id) {
                    this.records[i] = genericRecord;
                    break;
                }
            }
        }
        this.selectedRecord = null;
        this.recordErrors = {};
        this.showEditDialog = false;
        this.messages.push({
            severity: 'success',
            summary: 'Data saved',
            detail: isNew ? 'The data was added' : 'The data was saved'
        });
    }

    private onSaveError(recordErrors: any) {
        this.recordErrors = recordErrors;

        this.messages.push({
            severity: 'error',
            summary: 'Data save error',
            detail: 'There were error(s) saving the data'
        });
    }

    private onDeleteSuccess(genericRecord: GenericRecord) {
        for (let i = 0; i < this.records.length; i++) {
            if (this.records[i].id === genericRecord.id) {
                this.records.splice(i, 1);
            }
        }

        this.selectedRecord = null;
        this.recordErrors = {};
        this.showEditDialog = false;
        this.messages.push({
            severity: 'success',
            summary: 'Data deleted',
            detail: 'The data was deleted'
        });
    }

    private onDeleteError(recordErrors: any) {
        this.messages.push({
            severity: 'error',
            summary: 'Data delete error',
            detail: 'There were error(s) deleting the data'
        });
    }
}

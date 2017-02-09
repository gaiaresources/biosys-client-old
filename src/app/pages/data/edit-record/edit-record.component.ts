import { Component, OnInit, ViewChild } from '@angular/core';
import { APIService, APIError, Project, Dataset, Record } from '../../../shared/index';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService, SelectItem, Message } from 'primeng/primeng';
import * as moment from 'moment/moment';

@Component({
    moduleId: module.id,
    selector: 'biosys-data-edit-record',
    templateUrl: 'edit-record.component.html',
    styleUrls: [],
})

export class EditRecordComponent implements OnInit {
    private static AMBIGOUS_DATE_PATTERN: RegExp = /^(\d{1,2}).(\d{1,2}).(\d{4})$/;

    public breadcrumbItems: any = [];
    public messages: Message[] = [];
    public recordErrors: any = {};
    public dropdownItems: any = {};

    public record: Record;

    private dataset: Dataset;
    private completeUrl: string;

    constructor(private apiService: APIService, private router: Router, private route: ActivatedRoute,
                private confirmationService: ConfirmationService) {
    }

    ngOnInit() {
        let params = this.route.snapshot.params;

        let projId: number = Number(params['projId']);
        let datasetId: number = Number(params['datasetId']);

        this.apiService.getProjectById(projId).subscribe(
            (project: Project) => this.breadcrumbItems.splice(1, 0, {
                label: 'Datasets for ' + project.title,
                routerLink: ['/data/projects/' + projId + '/datasets']
            }),
            (error: APIError) => console.log('error.msg', error.msg)
        );

        this.apiService.getDatasetById(datasetId).subscribe(
            (dataset: Dataset) => {
                this.dataset = dataset;
                this.breadcrumbItems.splice(1, 0, {
                    label: 'Records for dataset ' + dataset.name,
                    routerLink: ['/data/projects/' + projId + '/datasets/' + datasetId]
                });

                if('recordId' in params) {
                    this.apiService.getRecordById(Number(params['recordId'])).subscribe(
                        (record: Record) => {
                            this.record = record;
                            this.formatRecord();
                        },
                        (error: APIError) => console.log('error.msg', error.msg)
                    );
                } else {
                    let data: any = {};
                    for(let datum of this.dataset.data_package.resources[0].schema.fields) {
                        data[datum['name']] = '';
                    }

                    this.record = <Record> {
                        dataset: this.dataset.id,
                        data: data
                    };
                }
            },
            (error: APIError) => console.log('error.msg', error.msg)
        );

        this.breadcrumbItems = [
            {label: 'Management - Project List', routerLink: ['/data/projects']},
            {label: 'recordId' in params ? 'Edit Record' : 'Create Record'}
        ];

        this.completeUrl = '/data/projects/' + projId + '/datasets/' + datasetId;
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
        let recordCopy = JSON.parse(JSON.stringify(this.record));

        // convert Date types back to string in DD/MM/YYYY format
        for(let field of this.dataset.data_package.resources[0].schema.fields) {
            if(field.type === 'date' && recordCopy.data[field.name]) {
                recordCopy.data[field.name] = moment(recordCopy.data[field.name]).format('DD/MM/YYYY');
            }
        }

        if('id' in recordCopy) {
            this.apiService.updateRecord(recordCopy.id, recordCopy)
                .subscribe(
                    (record: Record) => this.onSaveSuccess(record),
                    (error: APIError) => this.onSaveError(error)
                );
        } else {
            this.apiService.createRecord(recordCopy)
                .subscribe(
                    (record: Record) => this.onSaveSuccess(record),
                    (error: APIError) => this.onSaveError(error)
                );
        }
    }

    public confirmDelete(event:any) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this record?',
            accept: () =>  this.apiService.deleteRecord(this.record.id).subscribe(
                (record: Record) => this.onDeleteSuccess(this.record),
                (error: APIError) => this.onDeleteError(error))
        });
    }

    public cancel() {
        this.router.navigate([this.completeUrl]);
    }

    private onSaveSuccess(record: Record) {
        this.router.navigate([this.completeUrl, {'recordSaved': true}]);
    }

    private onSaveError(error: any) {
        this.recordErrors = {};

        for(let err of error.msg.data) {
            err = err.substring(1, err.length - 1);
            let keyValue: string[] = err.split(',');
            this.recordErrors[keyValue[0].substring(1, keyValue[0].length - 1)] =
                keyValue[1].substring(2, keyValue[1].length - 1);
        }

        this.messages.push({
            severity: 'error',
            summary: 'Record save error',
            detail: 'There were error(s) saving the record'
        });
    }

    private onDeleteSuccess(record: Record) {
        this.router.navigate([this.completeUrl, {'recordDeleted': true}]);
    }

    private onDeleteError(recordErrors: any) {
        this.messages.push({
            severity: 'error',
            summary: 'Record delete error',
            detail: 'There were error(s) deleting the record'
        });
    }

    private formatRecord() {
        // convert date fields to Date type because calendar element in form expects a Date
        for(let field of this.dataset.data_package.resources[0].schema.fields) {
            if(field.type === 'date') {
                // If date in DD?MM?YYYY format (where ? is any single char), convert to American (as Chrome, Firefox
                // and IE expect this when creating Date from a string
                let dateString:string = this.record.data[field.name];
                let regexGroup: string[] = dateString.match(EditRecordComponent.AMBIGOUS_DATE_PATTERN);
                if(regexGroup) {
                    dateString = regexGroup[2] + '/' + regexGroup[1] + '/' + regexGroup[3];
                }
                this.record.data[field.name] = new Date(dateString);
            }
        }
    }
}

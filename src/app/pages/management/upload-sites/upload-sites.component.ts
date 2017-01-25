import { Component, OnInit, ViewChild } from '@angular/core';
import { APIService } from '../../../shared/index';
import { Message, FileUpload } from 'primeng/primeng';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'biosys-upload-site',
    templateUrl: 'upload-sites.component.html',
    styleUrls: [],
})

export class UploadSitesComponent implements OnInit {
    accepted_types = [
        'text/csv',
        'text/comma-separated-values',
        'application/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/vnd.msexcel'
    ];

    messages: Message[] = [];
    url: string = null;
    projectId: number;
    @ViewChild(FileUpload)
    uploader: FileUpload;

    constructor(private apiService: APIService,
                private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        let params = this.route.snapshot.params;
        this.projectId = params['projectId'];
        this.url = this.apiService.getProjectSiteUploadURL(this.projectId);
    }

    onUpload() {
        let successUrl = '/management/projects/edit-project/' + this.projectId;
        return this.router.navigate([successUrl]);
    }

    onError(event: any) {
        const addErrorMessage = (summary: any, detail: any) => {
            this.messages.push({
                severity: 'error',
                summary: summary.toString(),
                detail: detail.toString()
            });
        };
        this.messages = [];
        let statusCode = event.xhr.status;
        let resp = event.xhr.response;
        if (statusCode === 400) {
            resp = JSON.parse(resp);
            // find errors
            for (let rowNumber of Object.getOwnPropertyNames(resp)) {
                let error = resp[rowNumber]['error'];
                if (error) {
                    addErrorMessage('Row #' + rowNumber, error);
                }
            }
        } else {
            addErrorMessage('Error', statusCode + ':' + resp);
        }
    }

    onBeforeSend(event: any) {
        let xhr = event.xhr;
        for (let header of this.apiService.getAuthHeaders()) {
            xhr.setRequestHeader(header[0], header[1]);
        }
    }

    onSelect(event: any) {
        // check file type (the last in the list)
        // use the file list of uploader instead of the file list given in the event so we can add/remove to it.
        let files: File[] = this.uploader.files;
        let file: File = files.pop();
        if (this.accepted_types.indexOf(file.type) === -1) {
            this.messages = [];
            this.messages.push({
                severity: 'info',
                summary: 'Wrong file type',
                detail: 'It must be an Excel (.xlsx) or a csv file.'
            });
        } else {
            // put back the file in the list
            files.push(file);
        }
    }
}

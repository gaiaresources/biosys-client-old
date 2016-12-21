import { Component, OnInit } from '@angular/core';
import { APIService } from '../../../shared/index';
import { Message } from 'primeng/primeng';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'bios-upload-site',
    templateUrl: 'upload-sites.component.html',
    styleUrls: [],
})

export class UploadSitesComponent implements OnInit {
    messages: Message[] = [];
    url: string = null;
    projectId: number;

    constructor(private apiService: APIService,
                private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        let params = this.route.snapshot.params;
        this.projectId = params['projectId'];
        this.url = this.apiService.getProjectSiteUploadURL(this.projectId);
    }

    onBeforeUpload(event: any) {
        let xhr = event.xhr;
        if (this.apiService.authToken) {
            xhr.setRequestHeader('Authorization', 'Token ' + this.apiService.authToken);
        }
    }

    onUpload() {
        let successUrl = '/projects/edit-project/' + this.projectId;
        return this.router.navigate([successUrl])
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
        let resp = JSON.parse(event.xhr.response);
        if (statusCode === 400) {
            // find errors
            for (let rowNumber of Object.getOwnPropertyNames(resp)) {
                let error = resp[rowNumber]['error'];
                if (error) {
                    addErrorMessage('Row #' + rowNumber, error)
                }
            }
        }
        else {
            addErrorMessage('Error', resp)
        }
    }
}

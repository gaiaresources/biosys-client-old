import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { APIService, APIError, Dataset } from '../../../shared/index';
import { SelectItem , Message } from 'primeng/primeng';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'bios-upload-site',
    templateUrl: 'upload-sites.component.html',
    styleUrls: [],
})

export class UploadSitesComponent implements OnInit {
    messages: Message[] = [];
    url:string = null;

    constructor(
        private apiService: APIService,
        private router: Router,
        private route: ActivatedRoute

    ) { }

    ngOnInit(): void {
        let params = this.route.snapshot.params;
        let projectId = params['projectId'];
        this.url = this.apiService.getProjectSiteUploadURL(projectId);
        console.log('this.url', this.url);
    }

    onBeforeUpload(event: any) {
        console.log('Before', event);
        let formData = event.formData;
        let xhr = event.xhr;
        if (this.apiService.authToken) {
            xhr.setRequestHeader('Authorization', 'Token ' + this.apiService.authToken);
        }

    }

    onUpload(event: any) {
        console.log('After', event);
    }

    onError(event:any) {
        console.log('Error', event);
    }
}

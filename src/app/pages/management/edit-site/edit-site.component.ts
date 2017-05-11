import { Component, OnInit, ViewChild } from '@angular/core';
import { APIService, APIError, Project, Site, FeatureMapComponent } from '../../../shared/index';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService, Message } from 'primeng/primeng';

@Component({
    moduleId: module.id,
    selector: 'biosys-edit-site',
    templateUrl: 'edit-site.component.html',
    styleUrls: [],
})

export class EditSiteComponent implements OnInit {
    public breadcrumbItems: any = [];

    @ViewChild(FeatureMapComponent)
    public featureMapComponent: FeatureMapComponent;

    public site: Site = <Site>{};
    public siteErrors: any = {};
    public messages: Message[] = [];
    public additionalAttributes: string[][] = [['', '']];

    private completeUrl: string;

    constructor(private apiService: APIService,
                private router: Router,
                private route: ActivatedRoute,
                private confirmationService: ConfirmationService) {
    }

    ngOnInit() {
        let params = this.route.snapshot.params;

        let projId: number = Number(params['projId']);

        this.apiService.getProjectById(projId)
            .subscribe(
                (project: Project) => this.breadcrumbItems.splice(1, 0, {
                    label: 'Edit ' + project.title,
                    routerLink: ['/management/projects/edit-project/' + projId]
                }),
                (error: APIError) => console.log('error.msg', error.msg)
            );

        if ('id' in params) {
            this.apiService.getSiteById(Number(params['id'])).subscribe(
                (site: Site) => {
                    this.site = site;
                    if (this.site.attributes) {
                        this.additionalAttributes = Object.keys(this.site.attributes).map((k) => [k, this.site.attributes[k]]);
                    }
                    this.breadcrumbItems.push({label: 'Edit ' + this.site.name});
                },
                (error: APIError) => console.log('error.msg', error.msg),
            );
        } else {
            this.site.project = projId;
        }

        this.breadcrumbItems = [
            {label: 'Management - Project List', routerLink: ['/management/projects']},
        ];

        if (!('id' in params)) {
            this.breadcrumbItems.push({label: 'Create Site '});
        }

        this.completeUrl = '/management/projects/edit-project/' + projId;
    }

    public addAdditionalAttribute() {
        this.additionalAttributes.push(['', '']);
    }

    public removeAdditionalAttribute(index: number) {
        this.additionalAttributes.splice(index, 1);
    }

    public save() {
        this.site.attributes = this.additionalAttributes.reduce((acc: any, cur: any) => {
                if (cur[0]) {
                    acc[cur[0]] = cur[1];
                }
                return acc;
            }, {}
        );

        this.site.geometry = this.featureMapComponent.getFeatureGeometry();

        if (this.site.id) {
            this.apiService.updateSite(this.site).subscribe(
                () => this.router.navigate([this.completeUrl, {'siteSaved': true}]),
                (errors: APIError) => this.siteErrors = errors.text
            );
        } else {
            this.apiService.createSite(this.site).subscribe(
                () => this.router.navigate([this.completeUrl, {'siteSaved': true}]),
                (errors: APIError) => this.siteErrors = errors.text
            );
        }
    }

    public cancel() {
        this.router.navigate([this.completeUrl]);
    }

    public confirmDelete(event:any) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this site?',
            accept: () =>  this.apiService.deleteSite(this.site.id).subscribe(
                (site: Site) => this.onDeleteSuccess(this.site),
                (error: APIError) => this.onDeleteError(error))
        });
    }

    private onDeleteSuccess(site: Site) {
        this.router.navigate([this.completeUrl, {'siteDeleted': true}]);
    }

    private onDeleteError(recordErrors: any) {
        this.messages.push({
            severity: 'error',
            summary: 'Site delete error',
            detail: 'There were error(s) deleting the site'
        });
    }
}

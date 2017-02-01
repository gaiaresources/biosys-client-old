import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { APIService, APIError, Project, Site, FeatureMapComponent } from '../../../shared/index';
import { Router, ActivatedRoute } from '@angular/router';

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

    constructor(private apiService: APIService,
                private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        let params = this.route.snapshot.params;

        let projId: Number = Number(params['projId']);

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
                    this.breadcrumbItems.push({label: 'Edit ' + this.site.name});
                },
                (error: APIError) => console.log('error.msg', error.msg),
            );
        } else {
            this.site.project = Number(params['projId']);
        }

        this.breadcrumbItems = [
            {label: 'Management - Project List', routerLink: ['/management/projects']},
        ];

        if (!('id' in params)) {
            this.breadcrumbItems.push({label: 'Create Site '});
        }
    }

    save() {
        this.site.geometry = this.featureMapComponent.getFeatureGeometry();

        let successUrl = 'management/projects/edit-project/' + this.site.project;
        if (this.site.id) {
            this.apiService.updateSite(this.site).subscribe(
                () => this.router.navigate([successUrl]),
                (error: APIError) => console.log('error.msg', error.msg)
            );
        } else {
            this.apiService.createSite(this.site).subscribe(
                () => this.router.navigate([successUrl]),
                (error: APIError) => console.log('error.msg', error.msg)
            );
        }
    }
}

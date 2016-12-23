import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { APIService, APIError, Site, FeatureMapComponent } from '../../../shared/index';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'bios-edit-site',
    templateUrl: 'edit-site.component.html',
    styleUrls: [],
})

export class EditSiteComponent implements OnInit {
    @ViewChild(FeatureMapComponent)
    public featureMapComponent: FeatureMapComponent;

    public site: Site = <Site>{};

    constructor(private apiService: APIService,
                private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        let params = this.route.snapshot.params;
        if ('id' in params) {
            this.apiService.getSiteById(Number(params['id'])).subscribe(
                (site: Site) => this.site = site,
                (error: APIError) => console.log('error.msg', error.msg),
            );
        } else if ('projId' in params) {
            this.site.project = Number(params['projId']);
        } else {
            throw new Error('No project ID provided');
        }
    }

    save() {
        this.site.geometry = this.featureMapComponent.getFeatureGeometry();

        let successUrl = '/projects/edit-project/' + this.site.project;
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

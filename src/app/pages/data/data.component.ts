import { Component, OnInit } from '@angular/core';
import { APIService, APIError, Project } from '../../shared/index';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'bios-data',
    templateUrl: 'data.component.html',
    styleUrls: [],
})

export class DataComponent implements OnInit {

    constructor(private apiService: APIService, private router: Router) {
    }

    ngOnInit() {
    }
}

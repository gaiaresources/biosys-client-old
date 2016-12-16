import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { APIService, APIError, Dataset } from '../../../shared/index';
import { Router, ActivatedRoute } from '@angular/router';
import { JsonEditorComponent, JsonEditorOptions } from '../../../shared/index';

@Component({
    moduleId: module.id,
    selector: 'bios-edit-dataset',
    templateUrl: 'edit-dataset.component.html',
    styleUrls: [],
})

export class EditDatasetComponent implements OnInit {
    @Input('isValid')
    isValid: boolean = true;
    private ds: Dataset = <Dataset>{};
    private editorOptions: JsonEditorOptions;
    @ViewChild(JsonEditorComponent)
    private editor: JsonEditorComponent;

    constructor(private apiService: APIService,
                private router: Router,
                private route: ActivatedRoute) {
        this.editorOptions = new JsonEditorOptions();
        this.editorOptions.mode = 'code';
        this.editorOptions.modes = ['code', 'form', 'text', 'tree', 'view'];
        this.editorOptions.onChange = this.onEditorChanged.bind(this);
    }

    ngOnInit() {
        let params = this.route.snapshot.params;
        if ('id' in params) {
            this.apiService.getDatasetById(Number(params['id'])).subscribe(
                (ds: Dataset) => {
                    this.ds = ds;
                    this.editor.set(<JSON>this.ds.data_package);
                },
                (error: APIError) => console.log('error.msg', error.msg)
            );
        } else if ('projId' in params) {
            this.ds.project = Number(params['projId']);
        } else {
            throw new Error('No project ID provided');
        }
    }

    save() {
        let successUrl = '/projects/edit-project/' + this.ds.project;
        if (this.ds.id) {
            this.apiService.updateDataset(this.ds).subscribe(
                () => this.router.navigate([successUrl]),
                (error: APIError) => console.log('error.msg', error.msg)
            );
        } else {
            this.apiService.createDataset(this.ds).subscribe(
                () => this.router.navigate([successUrl]),
                (error: APIError) => console.log('error.msg', error.msg)
            );
        }
    }

    private onEditorChanged() {
        try {
            this.ds.data_package = this.editor.get();
            this.isValid = true;
        } catch (e) {
            this.isValid = false;
        }
    }
}

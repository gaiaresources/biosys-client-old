import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { APIService, APIError, Project, Dataset } from '../../../shared/index';
import { Router, ActivatedRoute } from '@angular/router';
import { JsonEditorComponent, JsonEditorOptions } from '../../../shared/index';
import { SelectItem, Message } from 'primeng/primeng';
import { ModelChoice } from '../../../shared/services/api/api.interfaces';

@Component({
    moduleId: module.id,
    selector: 'biosys-edit-dataset',
    templateUrl: 'edit-dataset.component.html',
    styleUrls: [],
})

export class EditDatasetComponent implements OnInit {
    public breadcrumbItems: any = [];
    public typeChoices: SelectItem[];
    public messages: Message[] = [];
    public ds: Dataset = <Dataset>{};
    public editorOptions: JsonEditorOptions;

    @Input()
    public isValid: boolean = true;

    @ViewChild(JsonEditorComponent)
    public editor: JsonEditorComponent;

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
            let datasetId: number = Number(params['id']);

            this.apiService.getDatasetById(datasetId).subscribe(
                (ds: Dataset) => {
                    this.ds = ds;
                    this.editor.set(<JSON>this.ds.data_package);
                    this.breadcrumbItems.push({label: 'Edit ' + this.ds.name});
                },
                (error: APIError) => console.log('error.msg', error.msg)
            );
        } else {
            this.ds.project = Number(params['projId']);
        }

        this.apiService.getModelChoices('dataset', 'type')
            .map(
                (choices: ModelChoice[]): SelectItem[] =>
                    choices.map((choice: ModelChoice): SelectItem => {
                        return {
                            label: choice.display_name,
                            value: choice.value
                        };
                    })
            )
            .subscribe(
                (choices: SelectItem[]) => this.typeChoices = choices,
                (error: APIError) => console.log('error.msg', error.msg)
            );

        this.breadcrumbItems = [
            {label: 'Management - Project List', routerLink: ['/management/projects']},
        ];

        if (!('id' in params)) {
            this.breadcrumbItems.push({label: 'Create Dataset '});
        }
    }

    save() {
        let successUrl = '/management/projects/edit-project/' + this.ds.project;
        if (this.ds.id) {
            this.apiService.updateDataset(this.ds).subscribe(
                () => this.router.navigate([successUrl]),
                (error: APIError) => console.log('error.msg', error.msg)
            );
        } else {
            this.apiService.createDataset(this.ds).subscribe(
                () => this.router.navigate([successUrl]),
                (error: APIError) => this.showError(error)
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

    private showError(error: APIError) {
        this.messages = [];
        let addErrorMessage = (detail: any) => {
            this.messages.push({
                severity: 'error',
                summary: 'Error',
                detail: detail.toString()
            });
        };
        if (typeof error.msg === 'object') {
            // API message format:
            /**
             * {
             *   'field_name': [error1, error2, ...],
             *   ....
             * }
             */
            for (let field in error.msg) {
                if (error.msg.hasOwnProperty(field)) {
                    addErrorMessage(field + ': ' + error.msg[field].join(';'));
                }
            }
        } else {
            addErrorMessage(error.msg);
        }
    }
}

import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { APIService, APIError, Dataset } from '../../../shared/index';
import { Router, ActivatedRoute } from '@angular/router';
import { JsonEditorComponent, JsonEditorOptions } from '../../../shared/index';
import { SelectItem , Message } from 'primeng/primeng';
import { ModelChoice } from '../../../shared/services/api/api.interfaces';

@Component({
    moduleId: module.id,
    selector: 'bios-edit-dataset',
    templateUrl: 'edit-dataset.component.html',
    styleUrls: [],
})

export class EditDatasetComponent implements OnInit {
    @Input('isValid')
    isValid: boolean = true;
    typeChoices: SelectItem[] = [
        {
            label: 'Generic',
            value: 'generic'
        },
        {
            label: 'Observation',
            value: 'observation'
        },
        {
            label: 'Species Observation',
            value: 'species_observation'
        },
    ];
    messages: Message[] = [];
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
        this.apiService.getModelChoices('dataset', 'type')
            .map(
                (choices: ModelChoice[]): SelectItem[] => {
                    return choices.map((choice: ModelChoice): SelectItem => {
                        return {
                            label: choice.display_name,
                            value: choice.value
                        };
                    });
                }
            )
            .subscribe(
                (choices: SelectItem[]) => this.typeChoices = choices,
                (error: APIError) => console.log('error.msg', error.msg)
            );
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
                (error: APIError) =>  this.showError(error)
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
        let addErrorMessage = (detail) => {
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
                addErrorMessage(field + ': ' + error.msg[field].join(';'));
            }
        } else {
            addErrorMessage(error.msg)
        }
    }
}

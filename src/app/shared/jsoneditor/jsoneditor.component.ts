import { Component, OnInit, ElementRef, Input } from '@angular/core';

import { JsonEditorOptions } from './jsoneditor.options';

// declare var editor: any;
let JSONEditor = require('jsoneditor');

import 'jsoneditor/dist/jsoneditor.min.css';

@Component({
    selector: 'json-editor',
    template: `<div></div>`,
})
export class JsonEditorComponent implements OnInit {
    public editor: any;

    @Input('options')
    private options: JsonEditorOptions;

    @Input('data')
    private data: Object;

    constructor(private rootElement: ElementRef) {
    }

    ngOnInit() {

        if (null === this.options) {
            throw new Error('"options" is required');
        }

        if (null === this.data) {
            this.data = {};
        }
        this.editor = new JSONEditor(this.rootElement.nativeElement, this.options, this.data);
    }

    public collapseAll() {
        this.editor.collapseAll();
    }

    public destroy() {
        this.editor.destroy();
    }

    public expandAll() {
        this.editor.expandAll();
    }

    public focus() {
        this.editor.focus();
    }

    public set(json: JSON) {
        this.editor.set(json);
    }

    public setMode(mode: string) {
        this.editor.setMode(mode);
    }

    public setName(name: string) {
        this.editor.setName(name);
    }

    public setSchema(schema: any) {
        this.editor.setSchema(schema);
    }

    public get(): JSON {
        return this.editor.get();
    }

    public getMode(): string {
        return this.editor.getMode();
    }

    public getName(): string {
        return this.editor.getName();
    }

    public getText(): string {
        return this.editor.getText();
    }


}

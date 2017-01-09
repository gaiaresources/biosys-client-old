import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestBed, async } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { Route } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

export function main() {

    describe('App component', () => {

        let config: Route[] = [];
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [FormsModule, RouterTestingModule.withRoutes(config)],
                declarations: [TestComponent, AppComponent],
                providers: [
                    {provide: APP_BASE_HREF, useValue: '/'}
                ]
            });
        });

        it('should build without a problem',
            async(() => {
                TestBed
                    .compileComponents()
                    .then(() => {
                        let fixture = TestBed.createComponent(TestComponent);
                        let compiled = fixture.nativeElement;

                        expect(compiled).toBeTruthy();
                    });
            }));
    });
}

@Component({
    selector: 'test-cmp',
    template: '<biosys-app></biosys-app>'
})

class TestComponent {
}




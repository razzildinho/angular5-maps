import { TestBed, async } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { DummyFormComponent } from './dummy-form/dummy-form.component';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [
                AppComponent,
                DummyFormComponent,
            ],
        }).compileComponents();
    }));
    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
    it(`should contain a 'app-dummy-form' component`, async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('app-dummy-form')).not.toBe(null);
    }));
});

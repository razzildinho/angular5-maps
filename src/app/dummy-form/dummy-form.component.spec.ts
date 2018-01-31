import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DummyFormComponent } from './dummy-form.component';

describe('DummyFormComponent', () => {
  let component: DummyFormComponent;
  let fixture: ComponentFixture<DummyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DummyFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DummyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

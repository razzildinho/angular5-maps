import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReverseGeocodeComponent } from './reverse-geocode.component';

describe('ReverseGeocodeComponent', () => {
  let component: ReverseGeocodeComponent;
  let fixture: ComponentFixture<ReverseGeocodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReverseGeocodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReverseGeocodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

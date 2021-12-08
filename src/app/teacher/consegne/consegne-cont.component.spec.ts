import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsegneContComponent } from './consegne-cont.component';

describe('ConsegneContComponent', () => {
  let component: ConsegneContComponent;
  let fixture: ComponentFixture<ConsegneContComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsegneContComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsegneContComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

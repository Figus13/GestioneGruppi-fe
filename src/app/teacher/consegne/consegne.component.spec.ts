import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsegneComponent } from './consegne.component';

describe('ConsegneComponent', () => {
  let component: ConsegneComponent;
  let fixture: ComponentFixture<ConsegneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsegneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsegneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

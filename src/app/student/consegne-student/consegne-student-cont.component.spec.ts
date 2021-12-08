import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsegneStudentContComponent } from './consegne-student-cont.component';

describe('ConsegneStudentContComponent', () => {
  let component: ConsegneStudentContComponent;
  let fixture: ComponentFixture<ConsegneStudentContComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsegneStudentContComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsegneStudentContComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

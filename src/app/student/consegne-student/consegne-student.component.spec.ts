import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsegneStudentComponent } from './consegne-student.component';

describe('ConsegneStudentComponent', () => {
  let component: ConsegneStudentComponent;
  let fixture: ComponentFixture<ConsegneStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsegneStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsegneStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

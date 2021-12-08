import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GruppiStudentComponent } from './gruppi-student.component';

describe('GruppiStudentComponent', () => {
  let component: GruppiStudentComponent;
  let fixture: ComponentFixture<GruppiStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GruppiStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GruppiStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

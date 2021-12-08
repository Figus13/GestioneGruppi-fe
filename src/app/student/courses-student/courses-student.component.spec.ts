import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesStudentComponent } from './courses-student.component';

describe('CoursesStudentComponent', () => {
  let component: CoursesStudentComponent;
  let fixture: ComponentFixture<CoursesStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursesStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

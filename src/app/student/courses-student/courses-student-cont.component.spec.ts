import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesStudentContComponent } from './courses-student-cont.component';

describe('CoursesStudentContComponent', () => {
  let component: CoursesStudentContComponent;
  let fixture: ComponentFixture<CoursesStudentContComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursesStudentContComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesStudentContComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

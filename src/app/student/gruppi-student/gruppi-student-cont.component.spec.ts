import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GruppiStudentContComponent } from './gruppi-student-cont.component';

describe('GruppiStudentContComponent', () => {
  let component: GruppiStudentContComponent;
  let fixture: ComponentFixture<GruppiStudentContComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GruppiStudentContComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GruppiStudentContComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VmsStudentContComponent } from './vms-student-cont.component';

describe('VmsStudentContComponent', () => {
  let component: VmsStudentContComponent;
  let fixture: ComponentFixture<VmsStudentContComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VmsStudentContComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmsStudentContComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

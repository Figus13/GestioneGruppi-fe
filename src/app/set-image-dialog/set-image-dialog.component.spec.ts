import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetImageDialogComponent } from './set-image-dialog.component';

describe('TeacherImageDialogComponent', () => {
  let component: SetImageDialogComponent;
  let fixture: ComponentFixture<SetImageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetImageDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyVMDialogComponent } from './modify-vm-dialog.component';

describe('ModifyVMDialogComponent', () => {
  let component: ModifyVMDialogComponent;
  let fixture: ComponentFixture<ModifyVMDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyVMDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyVMDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

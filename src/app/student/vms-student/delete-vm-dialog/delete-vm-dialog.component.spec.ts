import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteVmDialogComponent } from './delete-vm-dialog.component';

describe('DeleteVmDialogComponent', () => {
  let component: DeleteVmDialogComponent;
  let fixture: ComponentFixture<DeleteVmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteVmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteVmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

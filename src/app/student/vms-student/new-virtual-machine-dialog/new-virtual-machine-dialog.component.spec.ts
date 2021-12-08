import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVirtualMachineDialogComponent } from './new-virtual-machine-dialog.component';

describe('NewVirtualMachineDialogComponent', () => {
  let component: NewVirtualMachineDialogComponent;
  let fixture: ComponentFixture<NewVirtualMachineDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewVirtualMachineDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewVirtualMachineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VmDialogComponent } from './vm-dialog.component';

describe('VmDialogComponent', () => {
  let component: VmDialogComponent;
  let fixture: ComponentFixture<VmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

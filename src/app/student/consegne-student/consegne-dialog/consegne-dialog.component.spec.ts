import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsegneDialogComponent } from './consegne-dialog.component';

describe('ConsegneDialogComponent', () => {
  let component: ConsegneDialogComponent;
  let fixture: ComponentFixture<ConsegneDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsegneDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsegneDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

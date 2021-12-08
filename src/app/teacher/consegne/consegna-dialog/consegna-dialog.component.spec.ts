import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsegnaDialogComponent } from './consegna-dialog.component';

describe('ConsegnaDialogComponent', () => {
  let component: ConsegnaDialogComponent;
  let fixture: ComponentFixture<ConsegnaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsegnaDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsegnaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

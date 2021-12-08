import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizzaConsegnaDialogComponent } from './visualizza-consegna-dialog.component';

describe('VisualizzaConsegnaDialogComponent', () => {
  let component: VisualizzaConsegnaDialogComponent;
  let fixture: ComponentFixture<VisualizzaConsegnaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizzaConsegnaDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizzaConsegnaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

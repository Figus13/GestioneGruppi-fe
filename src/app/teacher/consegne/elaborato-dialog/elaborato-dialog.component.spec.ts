import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElaboratoDialogComponent } from './elaborato-dialog.component';

describe('ElaboratiDialogComponent', () => {
  let component: ElaboratoDialogComponent;
  let fixture: ComponentFixture<ElaboratoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElaboratoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElaboratoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

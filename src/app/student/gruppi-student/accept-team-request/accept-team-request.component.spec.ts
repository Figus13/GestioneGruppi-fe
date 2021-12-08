import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptTeamRequestComponent } from './accept-team-request.component';

describe('AcceptTeamRequestComponent', () => {
  let component: AcceptTeamRequestComponent;
  let fixture: ComponentFixture<AcceptTeamRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptTeamRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptTeamRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomationDetails } from './automation-details';

describe('AutomationDetails', () => {
  let component: AutomationDetails;
  let fixture: ComponentFixture<AutomationDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutomationDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutomationDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

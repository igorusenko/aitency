import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomationEdit } from './automation-edit';

describe('AutomationEdit', () => {
  let component: AutomationEdit;
  let fixture: ComponentFixture<AutomationEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutomationEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutomationEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

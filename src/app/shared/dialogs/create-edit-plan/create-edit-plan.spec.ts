import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditPlan } from './create-edit-plan';

describe('CreateEditPlan', () => {
  let component: CreateEditPlan;
  let fixture: ComponentFixture<CreateEditPlan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEditPlan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEditPlan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePaymentMethod } from './create-payment-method';

describe('CreatePaymentMethod', () => {
  let component: CreatePaymentMethod;
  let fixture: ComponentFixture<CreatePaymentMethod>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePaymentMethod]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePaymentMethod);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

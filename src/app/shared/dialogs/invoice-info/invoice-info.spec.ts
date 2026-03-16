import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceInfo } from './invoice-info';

describe('InvoiceInfo', () => {
  let component: InvoiceInfo;
  let fixture: ComponentFixture<InvoiceInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedeemDialog } from './redeem-dialog';

describe('RedeemDialog', () => {
  let component: RedeemDialog;
  let fixture: ComponentFixture<RedeemDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedeemDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedeemDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

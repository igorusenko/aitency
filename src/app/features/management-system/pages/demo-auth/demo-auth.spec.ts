import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoAuth } from './demo-auth';

describe('DemoAuth', () => {
  let component: DemoAuth;
  let fixture: ComponentFixture<DemoAuth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoAuth]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemoAuth);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

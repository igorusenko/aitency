import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { confirmResetPasswordResolver } from './confirm-reset-password-resolver';

describe('confirmResetPasswordResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => confirmResetPasswordResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { confirmEmailResolver } from './confirm-email-resolver';

describe('confirmEmailResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => confirmEmailResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});

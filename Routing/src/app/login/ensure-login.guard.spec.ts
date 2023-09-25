import { TestBed } from '@angular/core/testing';

import { EnsureLoginGuard } from './ensure-login.guard';

describe('EnsureLoginGuard', () => {
  let guard: EnsureLoginGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EnsureLoginGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

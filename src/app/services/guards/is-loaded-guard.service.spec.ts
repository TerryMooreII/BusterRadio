/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { IsLoadedGuardService } from './is-loaded-guard.service';

describe('Service: IsLoadedGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsLoadedGuardService]
    });
  });

  it('should ...', inject([IsLoadedGuardService], (service: IsLoadedGuardService) => {
    expect(service).toBeTruthy();
  }));
});

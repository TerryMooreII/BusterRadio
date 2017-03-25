import { TestBed, inject } from '@angular/core/testing';

import { NullifyService } from './nullify.service';

describe('NullifyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NullifyService]
    });
  });

  it('should ...', inject([NullifyService], (service: NullifyService) => {
    expect(service).toBeTruthy();
  }));
});

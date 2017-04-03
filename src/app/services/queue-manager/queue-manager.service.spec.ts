import { TestBed, inject } from '@angular/core/testing';

import { QueueManagerService } from './queue-manager.service';

describe('QueueManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueueManagerService]
    });
  });

  it('should ...', inject([QueueManagerService], (service: QueueManagerService) => {
    expect(service).toBeTruthy();
  }));
});

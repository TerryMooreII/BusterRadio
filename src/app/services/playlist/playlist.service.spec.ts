/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PlaylistService } from './playlist.service';

describe('Service: Playlist', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlaylistService]
    });
  });

  it('should ...', inject([PlaylistService], (service: PlaylistService) => {
    expect(service).toBeTruthy();
  }));
});

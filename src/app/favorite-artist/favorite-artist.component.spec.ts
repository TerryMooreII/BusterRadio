import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteArtistComponent } from './favorite-artist.component';

describe('FavoriteArtistComponent', () => {
  let component: FavoriteArtistComponent;
  let fixture: ComponentFixture<FavoriteArtistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoriteArtistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteArtistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNavPlaylistComponent } from './side-nav-playlist.component';

describe('SideNavPlaylistComponent', () => {
  let component: SideNavPlaylistComponent;
  let fixture: ComponentFixture<SideNavPlaylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideNavPlaylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

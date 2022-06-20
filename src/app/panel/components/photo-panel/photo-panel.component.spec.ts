import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoPanelComponent } from './photo-panel.component';

describe('PhotoPanelComponent', () => {
  let component: PhotoPanelComponent;
  let fixture: ComponentFixture<PhotoPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhotoPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoSearchComponent } from './photo-search.component';

describe('PhotoSearchComponent', () => {
  let component: PhotoSearchComponent;
  let fixture: ComponentFixture<PhotoSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhotoSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

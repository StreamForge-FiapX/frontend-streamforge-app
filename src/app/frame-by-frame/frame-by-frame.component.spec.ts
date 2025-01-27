import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameByFrameComponent } from './frame-by-frame.component';

describe('FrameByFrameComponent', () => {
  let component: FrameByFrameComponent;
  let fixture: ComponentFixture<FrameByFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrameByFrameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrameByFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

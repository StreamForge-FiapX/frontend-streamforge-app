import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFramesComponent } from './my-frames.component';

describe('MyFramesComponent', () => {
  let component: MyFramesComponent;
  let fixture: ComponentFixture<MyFramesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyFramesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyFramesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

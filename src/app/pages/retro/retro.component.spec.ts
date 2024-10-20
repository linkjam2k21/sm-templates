import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetroComponent } from './retro.component';

describe('RetroComponent', () => {
  let component: RetroComponent;
  let fixture: ComponentFixture<RetroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RetroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

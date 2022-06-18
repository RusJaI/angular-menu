import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenviewComponent } from './screenview.component';

describe('ScreenviewComponent', () => {
  let component: ScreenviewComponent;
  let fixture: ComponentFixture<ScreenviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScreenviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

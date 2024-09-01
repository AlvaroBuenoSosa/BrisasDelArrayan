import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacarenaComponent } from './macarena.component';

describe('MacarenaComponent', () => {
  let component: MacarenaComponent;
  let fixture: ComponentFixture<MacarenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MacarenaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MacarenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

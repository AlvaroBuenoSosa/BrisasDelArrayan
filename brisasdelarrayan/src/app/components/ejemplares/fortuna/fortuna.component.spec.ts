import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FortunaComponent } from './fortuna.component';

describe('FortunaComponent', () => {
  let component: FortunaComponent;
  let fixture: ComponentFixture<FortunaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FortunaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FortunaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

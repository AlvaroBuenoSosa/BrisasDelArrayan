import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarmelaComponent } from './carmela.component';

describe('CarmelaComponent', () => {
  let component: CarmelaComponent;
  let fixture: ComponentFixture<CarmelaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarmelaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarmelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

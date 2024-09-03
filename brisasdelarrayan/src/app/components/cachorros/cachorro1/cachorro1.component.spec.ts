import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cachorro1Component } from './cachorro1.component';

describe('Cachorro1Component', () => {
  let component: Cachorro1Component;
  let fixture: ComponentFixture<Cachorro1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cachorro1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cachorro1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

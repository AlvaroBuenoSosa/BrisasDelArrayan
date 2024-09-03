import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cachorro3Component } from './cachorro3.component';

describe('Cachorro3Component', () => {
  let component: Cachorro3Component;
  let fixture: ComponentFixture<Cachorro3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cachorro3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cachorro3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

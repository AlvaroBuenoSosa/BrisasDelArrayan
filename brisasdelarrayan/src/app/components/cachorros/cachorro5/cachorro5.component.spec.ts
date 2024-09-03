import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cachorro5Component } from './cachorro5.component';

describe('Cachorro5Component', () => {
  let component: Cachorro5Component;
  let fixture: ComponentFixture<Cachorro5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cachorro5Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cachorro5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

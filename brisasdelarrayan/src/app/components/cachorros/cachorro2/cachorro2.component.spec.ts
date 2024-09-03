import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cachorro2Component } from './cachorro2.component';

describe('Cachorro2Component', () => {
  let component: Cachorro2Component;
  let fixture: ComponentFixture<Cachorro2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cachorro2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cachorro2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

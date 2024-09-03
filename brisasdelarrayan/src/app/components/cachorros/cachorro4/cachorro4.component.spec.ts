import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cachorro4Component } from './cachorro4.component';

describe('Cachorro4Component', () => {
  let component: Cachorro4Component;
  let fixture: ComponentFixture<Cachorro4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cachorro4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cachorro4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjemplaresPageComponent } from './ejemplares-page.component';

describe('EjemplaresComponent', () => {
  let component: EjemplaresPageComponent;
  let fixture: ComponentFixture<EjemplaresPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EjemplaresPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EjemplaresPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

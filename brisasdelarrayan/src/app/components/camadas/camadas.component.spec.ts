import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamadasComponent } from './camadas.component';

describe('CamadasComponent', () => {
  let component: CamadasComponent;
  let fixture: ComponentFixture<CamadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CamadasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CamadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

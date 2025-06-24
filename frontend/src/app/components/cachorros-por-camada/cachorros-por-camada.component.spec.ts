import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CachorrosPorCamadaComponent } from './cachorros-por-camada.component';

describe('CachorrosPorCamadaComponent', () => {
  let component: CachorrosPorCamadaComponent;
  let fixture: ComponentFixture<CachorrosPorCamadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CachorrosPorCamadaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CachorrosPorCamadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

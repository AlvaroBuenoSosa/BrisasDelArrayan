import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjemplaresDashboardComponent } from './ejemplares-dashboard.component';

describe('EjemplaresDashboardComponent', () => {
  let component: EjemplaresDashboardComponent;
  let fixture: ComponentFixture<EjemplaresDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EjemplaresDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EjemplaresDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

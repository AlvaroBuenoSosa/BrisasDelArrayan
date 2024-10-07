import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CachorrosDashboardComponent } from './cachorros-dashboard.component';

describe('CachorrosDashboardComponent', () => {
  let component: CachorrosDashboardComponent;
  let fixture: ComponentFixture<CachorrosDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CachorrosDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CachorrosDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

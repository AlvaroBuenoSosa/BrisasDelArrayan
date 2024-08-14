import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViniComponent } from './vini.component';

describe('ViniComponent', () => {
  let component: ViniComponent;
  let fixture: ComponentFixture<ViniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViniComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

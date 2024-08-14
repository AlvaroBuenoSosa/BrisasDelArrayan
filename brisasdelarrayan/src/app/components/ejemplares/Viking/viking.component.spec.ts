import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VikingComponent } from './viking.component';

describe('VikingComponent', () => {
  let component: VikingComponent;
  let fixture: ComponentFixture<VikingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VikingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VikingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

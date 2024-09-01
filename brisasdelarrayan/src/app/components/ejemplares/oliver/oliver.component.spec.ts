import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OliverComponent } from './oliver.component';

describe('OliverComponent', () => {
  let component: OliverComponent;
  let fixture: ComponentFixture<OliverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OliverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OliverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

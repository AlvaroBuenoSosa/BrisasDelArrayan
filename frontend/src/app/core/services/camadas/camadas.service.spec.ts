import { TestBed } from '@angular/core/testing';

import { CamadasService } from './camadas.service';

describe('CamadasService', () => {
  let service: CamadasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CamadasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

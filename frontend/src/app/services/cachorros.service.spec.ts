import { TestBed } from '@angular/core/testing';

import { CachorrosService } from './cachorros.service';

describe('CachorrosService', () => {
  let service: CachorrosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CachorrosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

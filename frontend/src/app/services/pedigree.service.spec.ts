import { TestBed } from '@angular/core/testing';

import { PedigreeService } from './pedigree.service';

describe('PedigreeService', () => {
  let service: PedigreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PedigreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

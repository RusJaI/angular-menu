import { TestBed } from '@angular/core/testing';

import { PosserviceService } from './posservice.service';

describe('PosserviceService', () => {
  let service: PosserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PosserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

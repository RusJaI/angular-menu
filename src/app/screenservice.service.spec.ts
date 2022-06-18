import { TestBed } from '@angular/core/testing';

import { ScreenserviceService } from './screenservice.service';

describe('ScreenserviceService', () => {
  let service: ScreenserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScreenserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
